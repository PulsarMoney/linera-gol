import * as linera from '@linera/client';
import { PrivateKey } from '@linera/signer';
import { ethers } from 'ethers';

export interface LineraBoard {
  size: number;
  liveCells: Array<{ x: number; y: number }>;
}

export interface Puzzle {
  id: string;
  title: string;
  summary: string;
  difficulty: "Easy" | "Medium" | "Hard";
  size: number;
  minimalSteps: number;
  maximalSteps: number;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface WalletInfo {
  chainId: string;
  createdAt: string;
}

export class LineraService {
  private static instance: LineraService | null = null;
  private client: linera.Client | null = null;
  private backend: linera.Application | null = null;
  private initialized = false;
  private walletInfo: WalletInfo | null = null;

  // Game of Life  app Id but its not used yet
  private static readonly GOL_APP_ID =
    "1aa3d7ffbe5f3f8b0459cf4066992ad5874f51def7a9164f3fe9fffc1c9b5e1a";
  private static readonly FAUCET_URL =
    "https://faucet.devnet-2025-08-21.linera.net/";

  private constructor() {}

  static getInstance(): LineraService {
    if (!this.instance) {
      this.instance = new LineraService();
    }
    return this.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("Initializing Linera service...");

      // Initialize Linera WebAssembly
      await linera.default();

      // TODO: Try to read existing wallet from browser storage
      let wallet;
      // TODO: Support connecting to an already existing signer.
      let signer = PrivateKey.fromMnemonic(ethers.Wallet.createRandom().mnemonic.phrase);
      const owner = await signer.address();

      if (!wallet) {
        console.log("No wallet found, creating new wallet from faucet...");

        // Create faucet and get new wallet
        const faucet = new linera.Faucet(LineraService.FAUCET_URL);
        const wallet = await faucet.createWallet();
        const chainId = await faucet.claimChain(wallet, owner);

        // Create client and claim chain
        this.client = await new linera.Client(wallet, signer);

        // Store wallet info
        localStorage.setItem("linera_chain_id", chainId);
        localStorage.setItem("linera_wallet_created", new Date().toISOString());

        this.walletInfo = {
          chainId,
          createdAt: new Date().toISOString(),
        };

        console.log("Wallet created successfully. Chain ID:", chainId);
      } else {
        console.log("Found existing wallet");

        // Create client with existing wallet
        this.client = await new linera.Client(wallet, signer);

        // Get stored wallet info
        const storedChainId = localStorage.getItem("linera_chain_id");
        const storedCreatedAt = localStorage.getItem("linera_wallet_created");

        if (storedChainId) {
          this.walletInfo = {
            chainId: storedChainId,
            createdAt: storedCreatedAt || new Date().toISOString(),
          };
        }
      }

      this.backend = await this.client.frontend().application(LineraService.GOL_APP_ID);

      this.initialized = true;
      console.log("Linera service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Linera service:", error);
      throw error;
    }
  }

  async checkWallet(): Promise<WalletInfo | null> {
    try {
      await linera.default();
      // TODO: Bring back once recovering wallets from
      // the storage is implemented.
      // const wallet = await linera.Wallet.read();

      // if (!wallet) {
      //   return null;
      // }

      const storedChainId = localStorage.getItem("linera_chain_id");
      const createdAt = localStorage.getItem("linera_wallet_created");

      if (!storedChainId || !createdAt) {
        return null;
      }

      return {
        chainId: storedChainId,
        createdAt: createdAt,
      };
    } catch (error) {
      console.error("Failed to check wallet:", error);
      return null;
    }
  }

  // Backend operations are disabled for now
  private async ensureInitialized(): Promise<void> {
    throw new Error("Backend operations are disabled");
  }

  async visualizeBoard(board: LineraBoard): Promise<string> {
    await this.ensureInitialized();
    // Implementation disabled
    throw new Error("Backend operations are disabled");
  }

  async advanceBoard(
    board: LineraBoard,
    steps: number = 1
  ): Promise<LineraBoard> {
    await this.ensureInitialized();
    // Implementation disabled
    throw new Error("Backend operations are disabled");
  }

  async validateSolution(
    board: LineraBoard,
    puzzleId: string,
    steps: number
  ): Promise<ValidationResult> {
    await this.ensureInitialized();
    // Implementation disabled
    throw new Error("Backend operations are disabled");
  }

  async submitSolution(
    puzzleId: string,
    board: LineraBoard,
    steps: number
  ): Promise<boolean> {
    await this.ensureInitialized();
    // Implementation disabled
    throw new Error("Backend operations are disabled");
  }

  async getPuzzle(puzzleId: string): Promise<Puzzle | null> {
    await this.ensureInitialized();
    // Implementation disabled
    throw new Error("Backend operations are disabled");
  }

  onNotification(callback: (notification: any) => void): void {
    if (this.client) {
      this.client.onNotification(callback);
    }
  }

  // Convert between our game format and Linera format
  static boardToLinera(cells: Map<string, boolean>, size: number): LineraBoard {
    const liveCells: Array<{ x: number; y: number }> = [];

    cells.forEach((alive, key) => {
      if (alive) {
        const [x, y] = key.split(",").map(Number);
        liveCells.push({ x, y });
      }
    });

    return { size, liveCells };
  }

  static lineraToBoard(lineraBoard: LineraBoard): Map<string, boolean> {
    const cells = new Map<string, boolean>();

    lineraBoard.liveCells.forEach(({ x, y }) => {
      cells.set(`${x},${y}`, true);
    });

    return cells;
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }
}
