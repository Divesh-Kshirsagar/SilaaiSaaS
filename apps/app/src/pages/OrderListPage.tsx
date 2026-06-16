import React from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  InlineLoading,
  Tag
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useHistory } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

const OrderListPage: React.FC = () => {
  const history = useHistory();
  const { data: orders, isLoading } = useOrders();

  const headers = [
    { key: 'orderNumber', header: 'Order Number' },
    { key: 'customer', header: 'Customer' },
    { key: 'deliveryDate', header: 'Delivery Date' },
    { key: 'status', header: 'Status' }
  ];

  const rows = orders?.map(o => ({
    id: o.id.toString(),
    orderNumber: o.orderNumber,
    customer: o.customer.name,
    deliveryDate: o.deliveryDate,
    status: o.status
  })) ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'gray';
      case 'CONFIRMED': return 'blue';
      case 'CUTTING':
      case 'STITCHING': return 'warm-gray';
      case 'QUALITY_CHECK': return 'purple';
      case 'READY':
      case 'DELIVERED': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Orders</h2>
        <Button renderIcon={Add} onClick={() => history.push('/orders/new')}>
          New Order
        </Button>
      </div>

      {isLoading ? <InlineLoading description="Loading orders..." /> : (
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps, onInputChange }: any) => (
            <TableContainer>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} persistent />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow
                      {...getRowProps({ row })}
                      onClick={() => history.push(`/orders/${row.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'status' ? (
                            <Tag type={getStatusColor(cell.value)}>{cell.value}</Tag>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      )}
    </div>
  );
};

export default OrderListPage;
