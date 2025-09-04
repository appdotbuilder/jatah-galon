import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, Scan, User, History, Shield, Download, Warehouse } from 'lucide-react';

export default function Welcome() {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleIdentify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId.trim()) return;
        
        setIsLoading(true);
        router.get('/employee', 
            { employee_id: employeeId },
            {
                onFinish: () => setIsLoading(false),
                onError: () => setIsLoading(false),
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Droplets className="h-8 w-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Jatah Galon</h1>
                        </div>
                        <Button 
                            onClick={() => router.visit('/login')}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <Shield className="h-4 w-4" />
                            <span>Admin Login</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <Droplets className="h-16 w-16 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        💧 Sistem Manajemen Jatah Galon
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Kelola jatah dan permintaan galon karyawan dengan mudah. 
                        Sistem otomatis yang memudahkan tracking kuota bulanan dan riwayat pengambilan.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Employee Identification */}
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Scan className="h-12 w-12 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl">Identifikasi Karyawan</CardTitle>
                            <CardDescription>
                                Masukkan ID Karyawan untuk melihat jatah dan riwayat galon Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleIdentify} className="space-y-4">
                                <div>
                                    <Label htmlFor="employee_id" className="text-base font-medium">
                                        ID Karyawan
                                    </Label>
                                    <Input
                                        id="employee_id"
                                        type="text"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        placeholder="Contoh: EMP001"
                                        className="mt-2 text-lg py-3"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full py-3 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Memproses...' : 'Identifikasi Karyawan'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">✨ Fitur Utama</h3>
                        
                        <div className="grid gap-4">
                            <Card className="border-l-4 border-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <User className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Profil Karyawan</h4>
                                            <p className="text-gray-600 text-sm">
                                                Lihat identitas, grade, dan kuota galon bulanan Anda
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-green-500">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Droplets className="h-6 w-6 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Permintaan Galon</h4>
                                            <p className="text-gray-600 text-sm">
                                                Ajukan permintaan galon sesuai kebutuhan dalam batas kuota
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-orange-500">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <History className="h-6 w-6 text-orange-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Riwayat Pengambilan</h4>
                                            <p className="text-gray-600 text-sm">
                                                Lacak semua riwayat pengambilan galon dengan detail tanggal dan waktu
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Admin Features */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        🔐 Panel Admin
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Admin HR</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Kelola data karyawan, tambah, edit, dan hapus karyawan
                                </p>
                                <div className="text-xs text-gray-500">
                                    • Manajemen data karyawan<br/>
                                    • Pengaturan grade dan kuota
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Admin Administrator</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Verifikasi permintaan dan unduh laporan Excel
                                </p>
                                <div className="text-xs text-gray-500">
                                    • Approval permintaan galon<br/>
                                    • Export laporan harian & bulanan
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <Warehouse className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Admin Gudang</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Verifikasi stok dan konfirmasi ketersediaan
                                </p>
                                <div className="text-xs text-gray-500">
                                    • Verifikasi ketersediaan stok<br/>
                                    • Konfirmasi galon siap ambil
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quota Information */}
                <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        📊 Jatah Galon per Grade
                    </h3>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { grade: 'G7-G8', quota: '24 galon/bulan', color: 'bg-blue-100 text-blue-800' },
                            { grade: 'G9', quota: '12 galon/bulan', color: 'bg-green-100 text-green-800' },
                            { grade: 'G10', quota: '10 galon/bulan', color: 'bg-yellow-100 text-yellow-800' },
                            { grade: 'G11-G13', quota: '7 galon/bulan', color: 'bg-purple-100 text-purple-800' },
                        ].map((item, index) => (
                            <div key={index} className={`p-4 rounded-lg ${item.color} text-center`}>
                                <div className="font-bold text-lg">{item.grade}</div>
                                <div className="text-sm">{item.quota}</div>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-center text-gray-600 mt-4 text-sm">
                        * Kuota direset setiap awal bulan
                    </p>
                </div>
            </div>
        </div>
    );
}