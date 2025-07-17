import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface EnhancedTableProps {
  title: string;
  description?: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  emptyMessage?: string;
}

export function EnhancedTable({
  title,
  description,
  columns,
  data,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  searchPlaceholder = "Rechercher...",
  addButtonText = "Ajouter",
  emptyMessage = "Aucune données disponible",
}: EnhancedTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(row => {
    const searchValue = searchTerm.toLowerCase();
    return columns.some(column => {
      const value = row[column.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchValue);
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        <Separator className="mb-4" />

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">{emptyMessage}</p>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter des données'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className="font-medium">
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.key)}
                          className="h-8 px-2 hover:bg-transparent"
                        >
                          {column.label}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={row.id || index} className="hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(row)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDelete(row)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Results Count */}
        {sortedData.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            {sortedData.length} résultat{sortedData.length > 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    active: { label: 'Actif', variant: 'default' as const },
    inactive: { label: 'Inactif', variant: 'secondary' as const },
    pending: { label: 'En attente', variant: 'default' as const },
    confirmed: { label: 'Confirmé', variant: 'default' as const },
    shipped: { label: 'Expédié', variant: 'default' as const },
    delivered: { label: 'Livré', variant: 'default' as const },
    cancelled: { label: 'Annulé', variant: 'destructive' as const },
    paid: { label: 'Payé', variant: 'default' as const },
    failed: { label: 'Échec', variant: 'destructive' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    variant: 'secondary' as const 
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}