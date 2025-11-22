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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  X,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'select' | 'boolean';
  filterOptions?: { value: string; label: string }[];
  render?: (value: any, row: any) => React.ReactNode;
}

interface FilterConfig {
  [key: string]: any;
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
  exportFileName?: string;
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
  exportFileName = "export",
}: EnhancedTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterConfig>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const exportToCsv = () => {
    const csvData = sortedData.map(row => {
      const csvRow: any = {};
      columns.forEach(column => {
        csvRow[column.label] = row[column.key];
      });
      return csvRow;
    });

    const csvContent = [
      columns.map(col => col.label).join(','),
      ...csvData.map(row => 
        columns.map(col => {
          const value = row[col.label];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFileName}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    const excelData = sortedData.map(row => {
      const excelRow: any = {};
      columns.forEach(column => {
        excelRow[column.label] = row[column.key];
      });
      return excelRow;
    });

    // Simple Excel export - in a real app, you'd use a library like xlsx
    const csvContent = [
      columns.map(col => col.label).join('\t'),
      ...excelData.map(row => 
        columns.map(col => row[col.label]).join('\t')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFileName}.xls`;
    link.click();
  };

  const filteredData = data.filter(row => {
    // Search filter
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || columns.some(column => {
      const value = row[column.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchValue);
    });

    // Column filters
    const matchesFilters = Object.entries(filters).every(([columnKey, filterValue]) => {
      if (!filterValue) return true;
      const rowValue = row[columnKey];
      return String(rowValue) === String(filterValue);
    });

    return matchesSearch && matchesFilters;
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

  const getFilterOptions = (columnKey: string) => {
    const uniqueValues = [...new Set(data.map(row => row[columnKey]))];
    return uniqueValues.map(value => ({
      value: String(value),
      label: String(value)
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} size="sm" className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex-1 md:flex-none"
            >
              <Filter className="h-4 w-4 md:mr-2" />
              <span className="md:inline">Filtrer</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  <Download className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Exporter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCsv}>
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Filtres avancés</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-3 w-3 mr-1" />
                  Réinitialiser
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.key} className="space-y-2">
                  <label className="text-sm font-medium">{column.label}</label>
                  <Select
                    value={filters[column.key] || 'all'}
                    onValueChange={(value) => handleFilterChange(column.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {column.filterOptions ? 
                        column.filterOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        )) :
                        getFilterOptions(column.key).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

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
              {searchTerm || activeFiltersCount > 0 ? 'Essayez de modifier votre recherche ou vos filtres' : 'Commencez par ajouter des données'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {sortedData.map((row, index) => (
                <Card key={row.id || index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {columns.map((column) => (
                        <div key={column.key} className="flex justify-between items-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                            {column.label}
                          </span>
                          <div className="text-sm text-right flex-1">
                            {column.render 
                              ? column.render(row[column.key], row)
                              : row[column.key]
                            }
                          </div>
                        </div>
                      ))}
                      
                      <Separator className="my-2" />
                      
                      <div className="flex gap-2">
                        {onView && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onView(row)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        )}
                        {onEdit && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEdit(row)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onDelete(row)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Results Count */}
        {sortedData.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            {sortedData.length} résultat{sortedData.length > 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
            {activeFiltersCount > 0 && ` avec ${activeFiltersCount} filtre${activeFiltersCount > 1 ? 's' : ''}`}
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