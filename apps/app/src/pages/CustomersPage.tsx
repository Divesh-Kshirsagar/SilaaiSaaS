import React, { useState } from 'react';
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
  Modal,
  TextInput,
  Stack,
  InlineLoading
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useHistory } from 'react-router-dom';
import { useCustomers, useCreateCustomer } from '../hooks/useCustomers';

const CustomersPage: React.FC = () => {
  const history = useHistory();
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const headers = [
    { key: 'name', header: 'Customer Name' },
    { key: 'phone', header: 'Phone Number' }
  ];

  const rows = customers?.map(c => ({ id: c.id.toString(), name: c.name, phone: c.phone })) ?? [];

  const handleSave = async () => {
    if (!name || !phone) return;
    await createMutation.mutateAsync({ name, phone });
    setShowModal(false);
    setName('');
    setPhone('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Customers</h2>
        <Button renderIcon={Add} onClick={() => setShowModal(true)}>
          New Customer
        </Button>
      </div>

      {isLoading ? <InlineLoading description="Loading customers..." /> : (
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
                      onClick={() => history.push(`/customers/${row.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      )}

      <Modal
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        onRequestSubmit={handleSave}
        primaryButtonText="Save Customer"
        primaryButtonDisabled={createMutation.isPending || !name || !phone}
        secondaryButtonText="Cancel"
        modalHeading="New Customer"
      >
        <Stack gap={5}>
          <TextInput
            id="customer-name"
            labelText="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            id="customer-phone"
            labelText="Phone Number"
            placeholder="10-digit number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
      </Modal>
    </div>
  );
};

export default CustomersPage;
