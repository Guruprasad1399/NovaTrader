import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip
} from '@mui/material';
import { format } from 'date-fns';

interface Order {
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    orderType: 'market' | 'limit';
    quantity: number;
    price: number;
    status: 'completed' | 'pending' | 'cancelled';
    date: Date;
}

// Mock data - replace this with actual API call in a real application
const mockOrders: Order[] = [
    { id: '1', symbol: 'AAPL', type: 'buy', orderType: 'market', quantity: 10, price: 150.50, status: 'completed', date: new Date('2023-05-01') },
    { id: '2', symbol: 'GOOGL', type: 'sell', orderType: 'limit', quantity: 5, price: 2500.75, status: 'pending', date: new Date('2023-05-02') },
    { id: '3', symbol: 'MSFT', type: 'buy', orderType: 'market', quantity: 15, price: 300.25, status: 'completed', date: new Date('2023-05-03') },
    { id: '4', symbol: 'TSLA', type: 'sell', orderType: 'limit', quantity: 8, price: 750.00, status: 'cancelled', date: new Date('2023-05-04') },
    // Add more mock orders as needed
];

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // In a real application, you would fetch the orders from an API here
        setOrders(mockOrders);
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Order History</Typography>
            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Order Type</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{format(order.date, 'yyyy-MM-dd HH:mm')}</TableCell>
                                    <TableCell>{order.symbol}</TableCell>
                                    <TableCell>{order.type.toUpperCase()}</TableCell>
                                    <TableCell>{order.orderType}</TableCell>
                                    <TableCell align="right">{order.quantity}</TableCell>
                                    <TableCell align="right">${order.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status) as "success" | "warning" | "error" | "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
};

export default OrderHistory;