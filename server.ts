import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- PERSISTENT CLOUD VAULT SYNC STORE ---
const VAULTS_FILE = path.join(process.cwd(), 'data', 'vaults_store.json');

interface DeviceEntry {
  deviceId: string;
  deviceName: string;
  deviceType: 'ios' | 'android' | 'desktop';
  ownerName: string;
  lastSeen: string;
}

interface VaultPayload {
  vaultCode: string;
  version: number;
  lastUpdated: string;
  lastUpdatedBy?: string;
  lastUpdatedDevice?: DeviceEntry;
  devices: DeviceEntry[];
  data: {
    profile?: any;
    projects?: any[];
    debts?: any[];
    targets?: any[];
    expenses?: any[];
    splitRule?: any;
  };
}

let vaultsMap: Record<string, VaultPayload> = {};

// Load persisted vaults on boot
try {
  if (fs.existsSync(VAULTS_FILE)) {
    const raw = fs.readFileSync(VAULTS_FILE, 'utf-8');
    vaultsMap = JSON.parse(raw);
    console.log(`[CloudSync] Loaded ${Object.keys(vaultsMap).length} synced vaults from disk.`);
  }
} catch (e) {
  console.warn('[CloudSync] Initializing fresh vault storage.');
}

function saveVaultsToDisk() {
  try {
    fs.writeFileSync(VAULTS_FILE, JSON.stringify(vaultsMap, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CloudSync] Error saving vaults to disk:', err);
  }
}

// Active Server-Sent Event (SSE) clients listening for real-time changes
const sseClients: Record<string, Response[]> = {};

function broadcastVaultUpdate(vaultCode: string, payload: VaultPayload) {
  const listeners = sseClients[vaultCode] || [];
  const eventData = `data: ${JSON.stringify(payload)}\n\n`;
  listeners.forEach((client) => {
    try {
      client.write(eventData);
    } catch (e) {
      // client disconnected
    }
  });
}

function generateVaultCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HV-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function upsertDevice(vault: VaultPayload, device?: DeviceEntry) {
  if (!device || !device.deviceId) return;
  if (!vault.devices) vault.devices = [];
  const idx = vault.devices.findIndex(d => d.deviceId === device.deviceId);
  const now = new Date().toISOString();
  const updatedDevice = { ...device, lastSeen: now };
  if (idx >= 0) {
    vault.devices[idx] = updatedDevice;
  } else {
    vault.devices.push(updatedDevice);
  }
}

// --- SYNC API ENDPOINTS ---

// 1. Create a new shared couple vault room
app.post('/api/sync/create', (req: Request, res: Response) => {
  try {
    const { customCode, initialData, updatedBy, device } = req.body;
    let code = (customCode || generateVaultCode()).toUpperCase().trim().replace(/[^A-Z0-9-]/g, '');
    if (!code) code = generateVaultCode();

    const newVault: VaultPayload = {
      vaultCode: code,
      version: 1,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: updatedBy || device?.deviceName || 'Haytham & Cati',
      lastUpdatedDevice: device,
      devices: device ? [{ ...device, lastSeen: new Date().toISOString() }] : [],
      data: initialData || {}
    };

    vaultsMap[code] = newVault;
    saveVaultsToDisk();

    console.log(`[CloudSync] Created shared vault room: ${code} with device ${device?.deviceId || 'unknown'}`);
    res.json({ success: true, vaultCode: code, vault: newVault });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 2. Join an existing shared couple vault room
app.post('/api/sync/join', (req: Request, res: Response) => {
  try {
    const { vaultCode, device } = req.body;
    const cleanCode = (vaultCode || '').toUpperCase().trim();
    const vault = vaultsMap[cleanCode];

    if (!vault) {
      return res.status(404).json({
        success: false,
        error: `Codul de seif "${cleanCode}" nu a fost găsit. Verificați codul introdus.`
      });
    }

    if (device) {
      upsertDevice(vault, device);
      saveVaultsToDisk();
      broadcastVaultUpdate(cleanCode, vault);
    }

    console.log(`[CloudSync] Device ${device?.deviceName || device?.deviceId || 'unknown'} joined vault: ${cleanCode}`);
    res.json({ success: true, vaultCode: cleanCode, vault });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 3. Register or heartbeat a device in the vault
app.post('/api/sync/:vaultCode/device', (req: Request, res: Response) => {
  try {
    const code = req.params.vaultCode.toUpperCase().trim();
    const { device } = req.body;
    const vault = vaultsMap[code];
    if (!vault) return res.status(404).json({ success: false, error: 'Vault not found' });

    if (device) {
      upsertDevice(vault, device);
      saveVaultsToDisk();
      broadcastVaultUpdate(code, vault);
    }

    res.json({ success: true, devices: vault.devices || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 4. Fetch latest vault snapshot
app.get('/api/sync/:vaultCode', (req: Request, res: Response) => {
  const code = req.params.vaultCode.toUpperCase().trim();
  const vault = vaultsMap[code];
  if (!vault) {
    return res.status(404).json({ success: false, error: 'Vault not found' });
  }
  res.json({ success: true, vault });
});

// 5. Push local changes to the shared couple vault (Bidirectional Sync)
app.post('/api/sync/:vaultCode/push', (req: Request, res: Response) => {
  try {
    const code = req.params.vaultCode.toUpperCase().trim();
    const { data, updatedBy, device } = req.body;

    const existing = vaultsMap[code] || {
      vaultCode: code,
      version: 0,
      lastUpdated: new Date().toISOString(),
      devices: [],
      data: {}
    };

    if (device) {
      upsertDevice(existing, device);
    }

    const newVersion = (existing.version || 0) + 1;
    const updatedVault: VaultPayload = {
      vaultCode: code,
      version: newVersion,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: updatedBy || device?.deviceName || existing.lastUpdatedBy || 'Haytham & Cati',
      lastUpdatedDevice: device || existing.lastUpdatedDevice,
      devices: existing.devices || [],
      data: {
        ...existing.data,
        ...data
      }
    };

    vaultsMap[code] = updatedVault;
    saveVaultsToDisk();

    // Broadcast instant update to all connected spouse devices
    broadcastVaultUpdate(code, updatedVault);

    console.log(`[CloudSync] Vault ${code} updated to v${newVersion} by ${updatedVault.lastUpdatedBy} [${device?.deviceId || ''}]`);
    res.json({ success: true, vault: updatedVault });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 5. Server-Sent Events (SSE) live real-time stream
app.get('/api/sync/:vaultCode/live', (req: Request, res: Response) => {
  const code = req.params.vaultCode.toUpperCase().trim();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients[code]) {
    sseClients[code] = [];
  }
  sseClients[code].push(res);

  // Send initial snapshot
  const current = vaultsMap[code];
  if (current) {
    res.write(`data: ${JSON.stringify(current)}\n\n`);
  }

  req.on('close', () => {
    if (sseClients[code]) {
      sseClients[code] = sseClients[code].filter((c) => c !== res);
      if (sseClients[code].length === 0) {
        delete sseClients[code];
      }
    }
  });
});

// API health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    name: 'HouseVault API',
    activeVaults: Object.keys(vaultsMap).length,
    timestamp: new Date().toISOString()
  });
});

// Server-side AI Advisor endpoint
app.post('/api/advisor', async (req: Request, res: Response) => {
  try {
    const { prompt, profile, projects, debts, targets, expenses } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const totalUncollected = (projects || [])
      .filter((p: any) => p.status !== 'COLLECTED' && (p.totalFee - (p.depositReceived || 0)) > 0)
      .reduce((s: number, p: any) => s + (p.totalFee - (p.depositReceived || 0)), 0);
    const totalDebt = (debts || []).reduce((s: number, d: any) => s + (d.currentBalance || 0), 0);
    const totalSaved = (targets || []).reduce((s: number, t: any) => s + (t.currentSavedAmount || 0), 0);
    const totalGoals = (targets || []).reduce((s: number, t: any) => s + (t.targetAmount || 0), 0);
    const fixedExpenses = (expenses || [])
      .filter((e: any) => e.isFixed)
      .reduce((s: number, e: any) => s + (e.amount || 0), 0);
    const wifeSurplus = Math.max(0, (profile?.wifeMonthlySalary || 0) - fixedExpenses);

    if (apiKey && apiKey.trim() !== '' && !apiKey.startsWith('MY_GEMINI')) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are HouseVault AI, a seasoned financial strategist specializing in dual-income couples where one partner is a freelance creative (videographer, filmmaker, editor, photographer) with irregular lump-sum gig payouts and the spouse has a predictable steady salary (e.g., IT support).

FINANCIAL STATE:
- Currency: ${profile?.currencySymbol || 'lei'} (${profile?.currencyCode || 'RON'})
- Freelance Partner: ${profile?.husbandName || 'Haytham (Videograf)'} (Est Gross: ${profile?.currencySymbol}${profile?.husbandEstMonthlyGross || 12000}/mo)
- Steady Salary Partner: ${profile?.wifeName || 'Cati (IT Support)'} (Salary: ${profile?.currencySymbol}${profile?.wifeMonthlySalary || 6500}/mo)
- Fixed Monthly Household Bills: ${profile?.currencySymbol}${fixedExpenses}/mo (Covered by steady salary, surplus: ${profile?.currencySymbol}${wifeSurplus}/mo)
- Outstanding Freelance Money Waiting to Be Collected: ${profile?.currencySymbol}${totalUncollected}
- Total Bank Debt: ${profile?.currencySymbol}${totalDebt} across ${(debts || []).length} accounts
- Total Savings Vaults: ${profile?.currencySymbol}${totalSaved} / ${profile?.currencySymbol}${totalGoals}

USER REQUEST:
${prompt}

GUIDELINES:
- Provide punchy, encouraging, mathematically sound and actionable advice in Romanian or English based on user query language.
- Emphasize the 35% Debt / 35% Savings / 15% Tax Reserve / 15% Safe Pocket allocation rule when freelance money is collected.
- Recommend the avalanche or snowball method for bank debt elimination.
- If asking about client follow-ups, provide copy-paste WhatsApp/SMS/Email reminder scripts.
- Use clear markdown with bold headers and bullet points.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemInstruction,
        });

        if (response && response.text) {
          return res.json({
            success: true,
            text: response.text,
            modelUsed: 'gemini-2.5-flash'
          });
        }
      } catch (genError: any) {
        console.warn('Gemini API call warning, falling back to expert local engine:', genError?.message);
      }
    }

    // Local deterministic intelligence engine fallback
    const localAdvice = generateLocalAdvice(prompt, profile, projects, debts, targets, expenses, totalUncollected, totalDebt, fixedExpenses);
    return res.json({
      success: true,
      text: localAdvice,
      modelUsed: 'local-expert-engine'
    });
  } catch (error: any) {
    console.error('Advisor endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process advice' });
  }
});

function generateLocalAdvice(
  prompt: string,
  profile: any,
  projects: any[],
  debts: any[],
  targets: any[],
  _expenses: any[],
  totalUncollected: number,
  totalDebt: number,
  fixedExpenses: number
): string {
  const sym = profile?.currencySymbol || 'lei';
  const lower = (prompt || '').toLowerCase();
  const wifeName = profile?.wifeName ? profile.wifeName.split(' ')[0] : 'Cati';
  const husbandName = profile?.husbandName ? profile.husbandName.split(' ')[0] : 'Haytham';

  if (lower.includes('split') || lower.includes('windfall') || lower.includes('gig') || lower.includes('commercial') || lower.includes('nunta') || lower.includes('wedding')) {
    return `### 💰 Regula de Aur a Distribuirii Încasărilor (35/35/15/15)

Deoarece salariul fix al lui ${wifeName} (**${sym}${profile?.wifeMonthlySalary || 6500}/lună**) acoperă integral costurile fixe ale casei (**${sym}${fixedExpenses}/lună**), **100% din banii încasați din proiectele video ale lui ${husbandName} pot fi direcționați strategic spre achitarea datoriilor și avansul pentru casă!**

De fiecare dată când intră un onorariu sau avans în cont:

- **35% ➔ Achitare Datorii Bancare**: Direcționat imediat spre cardul cu cea mai mare dobândă (${debts[0]?.bankName || 'Card Credit'}).
- **35% ➔ Seif Avans Casă & Siguranță**: Blocat instantaneu în contul dedicat locuinței.
- **15% ➔ Rezervă Taxe & Echipamente Video**: Fond tampon pentru taxe (PFA/SRL) și mentenanță/upgrade camere.
- **15% ➔ Bani de Buzunar (Safe Pocket)**: Recompensa lui ${husbandName} pentru finalizarea filmării și a montajului.

⚡ **Regula de Aur**: Faceți transferul celor 70% (Datorii + Seif) în primele **15 minute** de la intrarea banilor pe card, pentru a nu fi cheltuiți accidental!`;
  }

  if (lower.includes('debt') || lower.includes('datorii') || lower.includes('banca') || lower.includes('credit') || lower.includes('avalanche')) {
    const highestAprDebt = debts.slice().sort((a, b) => (b.interestRateApr || 0) - (a.interestRateApr || 0))[0];
    return `### 🏦 Strategia de Lichidare a Datoriilor (Metoda Avalanșei)

Totalul datoriilor bancare active este de **${sym}${totalDebt.toLocaleString()}**.

**Plan de Acțiune Imediat:**
1. **Prioritatea #1**: **${highestAprDebt?.bankName || 'Datoria cu Dobândă Mare'}** (Sold: ${sym}${(highestAprDebt?.currentBalance || 0).toLocaleString()}, DAE: ${highestAprDebt?.interestRateApr || 21.5}%).
2. **Plată Minimă pe Restul**: Mențineți plățile minime automate la celelalte credite pentru a nu avea penalizări.
3. **Încasări În Așteptare**: Aveți **${sym}${totalUncollected.toLocaleString()}** în facturi de colectat. Încasarea a două proiecte comerciale va achita peste 50% din soldul total!
4. **Surplus Salariu**: Folosiți ${sym}${Math.max(0, (profile?.wifeMonthlySalary || 6500) - fixedExpenses)} din surplusul lunar fix pentru plăți anticipate directe la principal.`;
  }

  return `### 🛡️ Situația Financiară HouseVault & Recomandări

- **Ancora Salarială Fixă**: Salariul de ${sym}${profile?.wifeMonthlySalary || 6500}/lună acoperă ${sym}${fixedExpenses}/lună în cheltuieli de bază, generând un surplus de ${sym}${Math.max(0, (profile?.wifeMonthlySalary || 6500) - fixedExpenses)}.
- **Motor Încasări Freelance**: ${sym}${totalUncollected.toLocaleString()} în facturi deschise gata de încasat.
- **Datorii Bancare**: ${sym}${totalDebt.toLocaleString()} în curs de achitare accelerată.
- **Seifuri Economii**: ${sym}${targets.reduce((s, t) => s + (t.currentSavedAmount || 0), 0).toLocaleString()} acumulați spre obiectivele familiei.

**Prioritatea Săptămânii**: Trimiteți mesajele de reamintire pe WhatsApp pentru facturile scadente, iar la fiecare încasare împărțiți imediat 35% datorii / 35% seif casă.`;
}

async function start() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error('Failed to initialize Vite middleware, falling back to static files:', e);
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HouseVault] Server listening on http://0.0.0.0:${PORT} with Cloud Sync active.`);
  });
}

start();
