import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    ClipboardList, 
    Check, 
    X, 
    Calendar,

    Warehouse,
    User,
    Clock,
    AlertCircle
} from 'lucide-react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
}

interface GallonRequest {
    id: number;
    quantity: number;
    status: string;
    requested_at: string;
    approved_at: string | null;
    stock_verified_at: string | null;
    completed_at: string | null;
    notes: string | null;
    employee: Employee;
}

interface PaginationData {
    data: GallonRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    requests: PaginationData;
    selectedDate: string;
    [key: string]: unknown;
}

export default function RequestIndex({ requests, selectedDate }: Props) {
    const [date, setDate] = useState(selectedDate);
    const [isLoading, setIsLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectNotes, setRejectNotes] = useState('');
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;

    const userRole = auth.user.role;
    const canApprove = userRole === 'administrator';
    const canVerifyStock = userRole === 'warehouse_admin';

    const handleDateChange = () => {
        router.visit(`/admin/requests?date=${date}`, {
            preserveState: false,
        });
    };

    const handleApprove = (requestId: number) => {
        setIsLoading(true);
        router.patch(`/admin/requests/${requestId}`, 
            { action: 'approve' },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleReject = (requestId: number) => {
        if (!rejectNotes.trim()) {
            alert('Harap masukkan alasan penolakan');
            return;
        }
        
        setIsLoading(true);
        router.patch(`/admin/requests/${requestId}`, 
            { 
                action: 'reject',
                notes: rejectNotes 
            },
            {
                preserveState: true,
                onSuccess: () => {
                    setRejectingId(null);
                    setRejectNotes('');
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleVerifyStock = (requestId: number) => {
        setIsLoading(true);
        router.patch(`/admin/requests/${requestId}`, 
            { action: 'verify-stock' },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'verified_stock': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu Approval';
            case 'approved': return 'Disetujui';
            case 'verified_stock': return 'Stok Terverifikasi';
            case 'completed': return 'Selesai';
            case 'rejected': return 'Ditolak';
            default: return status;
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                            <ClipboardList className="h-8 w-8 text-blue-600" />
                            <span>
                                {userRole === 'warehouse_admin' ? 'Verifikasi Stok' : 'Verifikasi Permintaan'}
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {userRole === 'warehouse_admin' 
                                ? 'Verifikasi ketersediaan stok galon'
                                : 'Verifikasi dan kelola permintaan galon karyawan'
                            }
                        </p>
                    </div>
                    

                </div>

                {/* Date Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <Label htmlFor="date">Filter Tanggal:</Label>
                            </div>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-auto"
                            />
                            <Button onClick={handleDateChange} variant="outline">
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Permintaan Tanggal {new Date(selectedDate).toLocaleDateString('id-ID')}
                        </CardTitle>
                        <CardDescription>
                            Total {requests.total} permintaan ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.data.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Tidak ada permintaan pada tanggal ini</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.data.map((request) => (
                                    <div key={request.id} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {request.employee.name}
                                                        </h3>
                                                        <Badge className={getStatusColor(request.status)}>
                                                            {getStatusText(request.status)}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <div className="flex items-center space-x-4">
                                                            <span>ID: {request.employee.employee_id}</span>
                                                            <span>Dept: {request.employee.department}</span>
                                                            <span>Grade: {request.employee.grade}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Diminta: {new Date(request.requested_at).toLocaleString('id-ID')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {request.quantity}
                                                </div>
                                                <div className="text-sm text-gray-500">galon</div>
                                            </div>
                                        </div>

                                        {request.notes && (
                                            <div className="bg-amber-50 border border-amber-200 rounded p-3">
                                                <div className="flex items-start space-x-2">
                                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-amber-800">Catatan:</p>
                                                        <p className="text-sm text-amber-700">{request.notes}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                                            {request.status === 'pending' && canApprove && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={isLoading}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Setujui
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setRejectingId(request.id)}
                                                        disabled={isLoading}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Tolak
                                                    </Button>
                                                </>
                                            )}

                                            {request.status === 'approved' && canVerifyStock && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerifyStock(request.id)}
                                                    disabled={isLoading}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Warehouse className="h-4 w-4 mr-1" />
                                                    Verifikasi Stok
                                                </Button>
                                            )}

                                            {request.status === 'verified_stock' && (
                                                <div className="text-sm text-green-600 font-medium">
                                                    ✓ Menunggu pengambilan karyawan
                                                </div>
                                            )}

                                            {request.status === 'completed' && (
                                                <div className="text-sm text-gray-600 font-medium">
                                                    ✓ Selesai - Diambil: {request.completed_at && new Date(request.completed_at).toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Reject Form */}
                                        {rejectingId === request.id && (
                                            <div className="bg-red-50 border border-red-200 rounded p-3 space-y-3">
                                                <Label htmlFor="reject_notes">Alasan Penolakan:</Label>
                                                <Input
                                                    id="reject_notes"
                                                    value={rejectNotes}
                                                    onChange={(e) => setRejectNotes(e.target.value)}
                                                    placeholder="Masukkan alasan penolakan..."
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={isLoading || !rejectNotes.trim()}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Konfirmasi Tolak
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setRejectingId(null);
                                                            setRejectNotes('');
                                                        }}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {requests.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {((requests.current_page - 1) * requests.per_page) + 1} - {Math.min(requests.current_page * requests.per_page, requests.total)} dari {requests.total} hasil
                                </div>
                                <div className="flex items-center space-x-2">
                                    {requests.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/requests?page=${requests.current_page - 1}&date=${selectedDate}`)}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {requests.current_page < requests.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/requests?page=${requests.current_page + 1}&date=${selectedDate}`)}
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}