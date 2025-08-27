import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { useLineraInitialization, useWallet } from '../lib/linera/hooks/useLineraQueries';
import { LineraService } from '@/lib/linera/services/LineraService';

export function Initialize() {
  const { isSuccess: isInitialized, isLoading: isInitializing, error: initError, refetch: retryInit } = useLineraInitialization();
  const { data: wallet, isLoading: isCheckingWallet, refetch: recheckWallet } = useWallet();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, `[LOG] ${args.join(' ')}`]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `[ERROR] ${args.join(' ')}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const handleManualInit = async () => {
    setLogs(prev => [...prev, '--- Manual initialization started ---']);
    try {
      const service = LineraService.getInstance();
      await service.initialize();
      setLogs(prev => [...prev, 'Manual initialization completed successfully']);
      recheckWallet();
    } catch (error) {
      setLogs(prev => [...prev, `Manual initialization failed: ${error}`]);
    }
  };

  const handleClearWallet = () => {
    setLogs(prev => [...prev, '--- Clearing wallet data ---']);
    localStorage.removeItem('linera_chain_id');
    localStorage.removeItem('linera_wallet_created');
    setLogs(prev => [...prev, 'Wallet data cleared from localStorage']);
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-linera-primary mb-8">Linera Wallet Initialization Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-linera-background-light border border-linera-background-lighter">
          <CardHeader>
            <h2 className="text-xl font-semibold text-linera-text">Initialization Status</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-linera-text-muted">Service Initialized:</span>
              <span className={`font-mono ${isInitialized ? 'text-success' : 'text-danger'}`}>
                {isInitializing ? 'Loading...' : isInitialized ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-linera-text-muted">Wallet Status:</span>
              <span className="font-mono text-linera-text">
                {isCheckingWallet ? 'Checking...' : wallet ? 'Connected' : 'Not Found'}
              </span>
            </div>
            {initError && (
              <div className="text-sm text-danger mt-2">
                Error: {initError instanceof Error ? initError.message : 'Unknown error'}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="bg-linera-background-light border border-linera-background-lighter">
          <CardHeader>
            <h2 className="text-xl font-semibold text-linera-text">Wallet Info</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {wallet ? (
              <>
                <div>
                  <span className="text-linera-text-muted">Chain ID:</span>
                  <div className="font-mono text-xs text-linera-text break-all mt-1">
                    {wallet.chainId}
                  </div>
                </div>
                <div>
                  <span className="text-linera-text-muted">Created At:</span>
                  <div className="text-linera-text mt-1">
                    {new Date(wallet.createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-linera-text-muted">
                {isCheckingWallet ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Checking for wallet...</span>
                  </div>
                ) : (
                  'No wallet found'
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="bg-linera-background-light border border-linera-background-lighter mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold text-linera-text">Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button
              color="primary"
              variant="solid"
              onPress={() => retryInit()}
              isLoading={isInitializing}
            >
              Retry Auto Init
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={handleManualInit}
            >
              Manual Initialize
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={() => recheckWallet()}
              isLoading={isCheckingWallet}
            >
              Recheck Wallet
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={handleClearWallet}
            >
              Clear Wallet Data
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-linera-background-light border border-linera-background-lighter">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-linera-text">Console Logs</h2>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setLogs([])}
          >
            Clear Logs
          </Button>
        </CardHeader>
        <CardBody>
          <div className="bg-black/90 rounded-lg p-4 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm">No logs yet...</div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`font-mono text-xs ${
                      log.includes('[ERROR]') ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}