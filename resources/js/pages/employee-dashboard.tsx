import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Droplets, 
    User, 
    Calendar, 
    Clock, 
    ArrowLeft, 
    Plus, 
    CheckCircle,
    AlertCircle,
    Building
} from 'lucide-react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    monthly_allowance: number;
}

interface Pickup {
    id: number;
    quantity: number;
    picked_up_at: string;
    gallon_request: {
        id: number;
        requested_at: string;
    };
}

interface PendingRequest {
    id: number;
    quantity: number;
    status: string;
    requested_at: string;
}

interface Props {
    employee: Employee;
    monthlyAllowance: number;
    totalUsed: number;
    remainingAllowance: number;
    pickups: Pickup[];
    pendingRequests: PendingRequest[];
    currentMonth: string;
    [key: string]: unknown;
}

export default function EmployeeDashboard({ 
    employee, 
    monthlyAllowance, 
    totalUsed, 
    remainingAllowance, 
    pickups, 
    pendingRequests,
    currentMonth 
}: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity <= 0 || quantity > remainingAllowance) return;
        
        setIsLoading(true);
        router.post('/request',
            { 
                employee_id: employee.id,
                quantity: quantity
            },
            {
                onSuccess: () => {
                    setQuantity(1);
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handlePickup = (requestId: number) => {
        router.patch('/pickup',
            { 
                action: 'pickup',
                request_id: requestId 
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Kembali</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <Droplets className="h-6 w-6 text-blue-600" />
                                <h1 className="text-xl font-bold text-gray-900">Dashboard Karyawan</h1>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {currentMonth}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Employee Info & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Employee Profile */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                                        <CardDescription>ID: {employee.employee_id}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Building className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{employee.department}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Grade:</span>
                                    <Badge variant="secondary">{employee.grade}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Statistik Bulan Ini</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Jatah Bulanan:</span>
                                        <span className="font-semibold">{monthlyAllowance} galon</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Sudah Diambil:</span>
                                        <span className="font-semibold text-blue-600">{totalUsed} galon</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Sisa Jatah:</span>
                                        <span className="font-semibold text-green-600">{remainingAllowance} galon</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ 
                                            width: `${monthlyAllowance > 0 ? (totalUsed / monthlyAllowance) * 100 : 0}%` 
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    {monthlyAllowance > 0 ? Math.round((totalUsed / monthlyAllowance) * 100) : 0}% terpakai
                                </p>
                            </CardContent>
                        </Card>

                        {/* New Request Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Plus className="h-5 w-5" />
                                    <span>Ajukan Permintaan</span>
                                </CardTitle>
                                <CardDescription>
                                    Ajukan permintaan galon sesuai kebutuhan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRequest} className="space-y-4">
                                    <div>
                                        <Label htmlFor="quantity">Jumlah Galon</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max={remainingAllowance}
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                            className="mt-1"
                                            disabled={remainingAllowance === 0}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maksimal: {remainingAllowance} galon
                                        </p>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        disabled={isLoading || remainingAllowance === 0 || quantity <= 0 || quantity > remainingAllowance}
                                    >
                                        {isLoading ? 'Memproses...' : 'Ajukan Permintaan'}
                                    </Button>
                                    {remainingAllowance === 0 && (
                                        <p className="text-xs text-amber-600 text-center">
                                            Jatah bulan ini sudah habis
                                        </p>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                        <span>Permintaan Pending</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Galon yang sudah diverifikasi dan siap diambil
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pendingRequests.map((request) => (
                                            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                                                <div className="flex items-center space-x-4">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {request.quantity} galon siap diambil
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Diminta: {new Date(request.requested_at).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handlePickup(request.id)}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Konfirmasi Pengambilan
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pickup History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5" />
                                    <span>Riwayat Pengambilan</span>
                                </CardTitle>
                                <CardDescription>
                                    Riwayat pengambilan galon bulan {currentMonth}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pickups.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Droplets className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Belum ada pengambilan galon bulan ini</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pickups.map((pickup, index) => (
                                            <div key={pickup.id}>
                                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-blue-100 p-2 rounded-full">
                                                            <Droplets className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {pickup.quantity} galon diambil
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(pickup.picked_up_at).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Selesai
                                                    </Badge>
                                                </div>
                                                {index < pickups.length - 1 && <Separator className="my-2" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}