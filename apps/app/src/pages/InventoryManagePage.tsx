import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Modal,
  TextInput,
  Stack,
  InlineLoading,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const InventoryManagePage: React.FC = () => {
  const queryClient = useQueryClient();

  // --- Fabrics State ---
  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ['fabrics'],
    queryFn: async () => (await api.get('/fabrics')).data,
  });

  const [showFabricModal, setShowFabricModal] = useState(false);
  const [fName, setFName] = useState('');
  const [fQty, setFQty] = useState<number>(0);
  const [fReorder, setFReorder] = useState<number>(50);

  const [stockModalFabricId, setStockModalFabricId] = useState<number | null>(null);
  const [stockChange, setStockChange] = useState<number>(0);

  const createFabric = useMutation({
    mutationFn: async (data: any) => await api.post('/fabrics', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fabrics'] }); setShowFabricModal(false); }
  });

  const addStock = useMutation({
    mutationFn: async ({ id, qty }: { id: number, qty: number }) =>
      await api.put(`/fabrics/${id}/stock`, { quantityChange: qty, reason: 'RESTOCK' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fabrics'] }); setStockModalFabricId(null); }
  });

  // --- Garments State ---
  const { data: garments, isLoading: garmentsLoading } = useQuery({
    queryKey: ['garments'],
    queryFn: async () => (await api.get('/garments')).data,
  });

  const [showGarmentModal, setShowGarmentModal] = useState(false);
  const [gName, setGName] = useState('');
  const [gPrice, setGPrice] = useState<number>(0);
  const [gCons, setGCons] = useState<number>(1.5);

  const createGarment = useMutation({
    mutationFn: async (data: any) => await api.post('/garments', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['garments'] }); setShowGarmentModal(false); }
  });

  // --- Tables Setup ---
  const fabricHeaders = [
    { key: 'name', header: 'Fabric Name' },
    { key: 'stock', header: 'Available Stock (m)' },
    { key: 'reorder', header: 'Reorder Level' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: '' }
  ];

  const fabricRows = fabrics?.map((f: any) => ({
    id: f.id.toString(),
    name: f.name,
    stock: f.quantityAvailable,
    reorder: f.reorderLevel,
    status: f.lowStock ? 'Low Stock' : 'OK'
  })) ?? [];

  const garmentHeaders = [
    { key: 'name', header: 'Garment Name' },
    { key: 'price', header: 'Base Price (₹)' },
    { key: 'fabric', header: 'Default Fabric Needed (m)' }
  ];

  const garmentRows = garments?.map((g: any) => ({
    id: g.id.toString(),
    name: g.name,
    price: g.basePrice,
    fabric: g.defaultFabricConsumptionMeters
  })) ?? [];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Inventory</h2>
      </div>

      <Tabs>
        <TabList aria-label="Inventory categories">
          <Tab>Fabrics</Tab>
          <Tab>Garments</Tab>
        </TabList>
        <TabPanels>
          {/* Fabrics Panel */}
          <TabPanel>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Button renderIcon={Add} onClick={() => setShowFabricModal(true)} size="sm">New Fabric</Button>
            </div>
            {fabricsLoading ? <InlineLoading /> : (
              <DataTable rows={fabricRows} headers={fabricHeaders}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                  <TableContainer>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header: any) => (
                            <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => (
                          <TableRow {...getRowProps({ row })}>
                            {row.cells.map((cell: any) => {
                              if (cell.info.header === 'status') {
                                return <TableCell key={cell.id}><Tag type={cell.value === 'OK' ? 'green' : 'red'}>{cell.value}</Tag></TableCell>;
                              }
                              if (cell.info.header === 'actions') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Button kind="ghost" size="sm" onClick={() => setStockModalFabricId(Number(row.id))}>Add Stock</Button>
                                  </TableCell>
                                );
                              }
                              return <TableCell key={cell.id}>{cell.value}</TableCell>;
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            )}
          </TabPanel>

          {/* Garments Panel */}
          <TabPanel>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Button renderIcon={Add} onClick={() => setShowGarmentModal(true)} size="sm">New Garment</Button>
            </div>
            {garmentsLoading ? <InlineLoading /> : (
              <DataTable rows={garmentRows} headers={garmentHeaders}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                  <TableContainer>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header: any) => (
                            <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => (
                          <TableRow {...getRowProps({ row })}>
                            {row.cells.map((cell: any) => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Fabric Modal */}
      <Modal open={showFabricModal} onRequestClose={() => setShowFabricModal(false)} onRequestSubmit={() => createFabric.mutate({ name: fName, quantityAvailable: fQty, reorderLevel: fReorder })} modalHeading="New Fabric" primaryButtonText="Save">
        <Stack gap={5}>
          <TextInput id="fName" labelText="Fabric Name" value={fName} onChange={e => setFName(e.target.value)} />
          <TextInput id="fQty" type="number" labelText="Initial Quantity (m)" value={fQty} onChange={e => setFQty(Number(e.target.value))} />
          <TextInput id="fReorder" type="number" labelText="Reorder Level (m)" value={fReorder} onChange={e => setFReorder(Number(e.target.value))} />
        </Stack>
      </Modal>

      {/* Stock Modal */}
      <Modal open={stockModalFabricId !== null} onRequestClose={() => setStockModalFabricId(null)} onRequestSubmit={() => addStock.mutate({ id: stockModalFabricId!, qty: stockChange })} modalHeading="Add Stock" primaryButtonText="Update">
        <Stack gap={5}>
          <TextInput id="stockChange" type="number" labelText="Quantity to Add (m)" value={stockChange} onChange={e => setStockChange(Number(e.target.value))} />
        </Stack>
      </Modal>

      {/* Garment Modal */}
      <Modal open={showGarmentModal} onRequestClose={() => setShowGarmentModal(false)} onRequestSubmit={() => createGarment.mutate({ name: gName, basePrice: gPrice, defaultFabricConsumptionMeters: gCons })} modalHeading="New Garment" primaryButtonText="Save">
        <Stack gap={5}>
          <TextInput id="gName" labelText="Garment Name" value={gName} onChange={e => setGName(e.target.value)} />
          <TextInput id="gPrice" type="number" labelText="Base Price (₹)" value={gPrice} onChange={e => setGPrice(Number(e.target.value))} />
          <TextInput id="gCons" type="number" labelText="Default Fabric Needed (m)" value={gCons} onChange={e => setGCons(Number(e.target.value))} />
        </Stack>
      </Modal>
    </div>
  );
};

export default InventoryManagePage;
