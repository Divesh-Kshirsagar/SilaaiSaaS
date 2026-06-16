import React from 'react';
import { Grid, Column, Tile, Button, Stack, InlineLoading } from '@carbon/react';
import { useDashboard } from '../hooks/useTasks';
import { useAuthStore } from '../stores/authStore';
import { ArrowRight, Add, Task, UserMultiple } from '@carbon/icons-react';
import { useHistory } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboard();
  const { user } = useAuthStore();
  const history = useHistory();

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Welcome back, {user?.name}</h2>

      {isLoading ? <InlineLoading description="Loading dashboard stats..." /> : (
        <Grid fullWidth>
          <Column lg={8} md={4} sm={4}>
            <Grid fullWidth>
              <Column lg={8} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                <Tile style={{ backgroundColor: '#0f62fe', color: '#ffffff' }}>
                  <h3>{stats?.pendingOrders ?? 0}</h3>
                  <p>Pending Orders</p>
                </Tile>
              </Column>
              <Column lg={8} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                <Tile style={{ backgroundColor: '#f1c21b', color: '#000000' }}>
                  <h3>{stats?.todayDeliveries ?? 0}</h3>
                  <p>Today's Deliveries</p>
                </Tile>
              </Column>
              <Column lg={8} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                <Tile style={{ backgroundColor: '#da1e28', color: '#ffffff' }}>
                  <h3>{stats?.lowStockCount ?? 0}</h3>
                  <p>Low Stock Items</p>
                </Tile>
              </Column>
              <Column lg={8} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                <Tile style={{ backgroundColor: '#24a148', color: '#ffffff' }}>
                  <h3>{stats?.readyOrders ?? 0}</h3>
                  <p>Ready to Deliver</p>
                </Tile>
              </Column>
            </Grid>
          </Column>

          <Column lg={8} md={4} sm={4}>
            <Tile>
              <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
              <Stack gap={4}>
                <Button kind="tertiary" renderIcon={ArrowRight} onClick={() => history.push('/orders/new')} style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Add size={20} /> Create New Order
                  </div>
                </Button>
                <Button kind="tertiary" renderIcon={ArrowRight} onClick={() => history.push('/tasks')} style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Task size={20} /> View Tasks
                  </div>
                </Button>
                <Button kind="tertiary" renderIcon={ArrowRight} onClick={() => history.push('/customers')} style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserMultiple size={20} /> Manage Customers
                  </div>
                </Button>
              </Stack>
            </Tile>
          </Column>
        </Grid>
      )}
    </div>
  );
};

export default DashboardPage;
