import { Card, CardBody, CardHeader } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { Wallet, AlertCircle } from 'lucide-react';
import { useLineraInitialization, useWallet } from '@/lib/linera/hooks/useLineraQueries';

export function BlockchainStatus() {
  const { isSuccess: isInitialized, isLoading: isInitializing, error: initError } = useLineraInitialization();
  const { data: wallet, isLoading: isCheckingWallet } = useWallet();

  const getStatusText = () => {
    if (isCheckingWallet) return 'Checking...';
    if (wallet) return 'Connected';
    if (initError) return 'Error';
    if (isInitializing) return 'Connecting...';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (wallet && isInitialized) return 'success';
    if (initError) return 'danger';
    if (isInitializing || isCheckingWallet) return 'warning';
    return 'default';
  };
  console.log('rerendering blockchain status');

  return (
    <Card className="bg-linera-background-light border border-linera-background-lighter">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-linera-primary" />
          <h3 className="text-lg font-semibold text-linera-text">Blockchain Status</h3>
        </div>
        <Badge 
          color={getStatusColor()}
          variant="flat"
          size="sm"
        >
          {getStatusText()}
        </Badge>
      </CardHeader>
      <CardBody className="space-y-4">
        {initError && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle size={16} />
            <span>{initError instanceof Error ? initError.message : 'Connection failed'}</span>
          </div>
        )}
        
        {wallet && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-linera-text-muted">Chain ID: </span>
              <span className="font-mono text-xs text-linera-text">
                {wallet.chainId.substring(0, 12)}...{wallet.chainId.substring(wallet.chainId.length - 8)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-linera-text-muted">Created: </span>
              <span className="text-linera-text">
                {new Date(wallet.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
        
        {!wallet && !isCheckingWallet && isInitializing && (
          <div className="text-sm text-linera-text-muted">
            Initializing wallet from faucet... This may take a moment.
          </div>
        )}
        
        {!wallet && !isCheckingWallet && !isInitializing && (
          <div className="text-sm text-linera-text-muted">
            Unable to connect to wallet. Please refresh the page to try again.
          </div>
        )}
      </CardBody>
    </Card>
  );
}