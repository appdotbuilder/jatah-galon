import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Users, 
    ClipboardList, 
    Warehouse, 
    BarChart3,
    Droplets,
    Shield,
    Building,

} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}



export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const getRoleName = (role: string) => {
        switch (role) {
            case 'hr_admin': return 'Admin HR';
            case 'administrator': return 'Administrator';
            case 'warehouse_admin': return 'Admin Gudang';
            default: return role;
        }
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'hr_admin': return 'Mengelola data karyawan dan jatah galon';
            case 'administrator': return 'Verifikasi permintaan dan unduh laporan';
            case 'warehouse_admin': return 'Verifikasi stok dan konfirmasi ketersediaan';
            default: return 'Akses sistem manajemen galon';
        }
    };

    const getAvailableFeatures = (role: string) => {
        const features = [];
        
        if (role === 'hr_admin') {
            features.push(
                {
                    title: 'Manajemen Karyawan',
                    description: 'Tambah, edit, dan hapus data karyawan',
                    icon: Users,
                    action: () => router.visit('/admin/employees'),
                    color: 'bg-blue-500',
                },
            );
        }
        
        if (role === 'administrator' || role === 'warehouse_admin') {
            features.push(
                {
                    title: role === 'administrator' ? 'Verifikasi Permintaan' : 'Verifikasi Stok',
                    description: role === 'administrator' ? 'Approve dan tolak permintaan galon' : 'Verifikasi ketersediaan stok galon',
                    icon: role === 'administrator' ? ClipboardList : Warehouse,
                    action: () => router.visit('/admin/requests'),
                    color: role === 'administrator' ? 'bg-green-500' : 'bg-purple-500',
                },
            );
        }

        if (role === 'administrator') {
            features.push(

            );
        }

        return features;
    };

    const features = getAvailableFeatures(user.role);

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Selamat datang, {user.name}!
                            </h1>
                            <p className="text-blue-100 mt-2">
                                {getRoleName(user.role)} - {getRoleDescription(user.role)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Droplets className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Sistem</p>
                                    <p className="text-2xl font-bold">Jatah Galon</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Role Anda</p>
                                    <p className="text-lg font-bold">{getRoleName(user.role)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <Building className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Akses Level</p>
                                    <p className="text-lg font-bold">Admin</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <BarChart3 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <p className="text-lg font-bold text-green-600">Aktif</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fitur yang Tersedia</CardTitle>
                        <CardDescription>
                            Akses fitur sesuai dengan role Anda sebagai {getRoleName(user.role)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {features.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Tidak ada fitur khusus tersedia untuk role Anda</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {features.map((feature, index) => (
                                    <Card key={index} className="border hover:shadow-md transition-shadow cursor-pointer" onClick={feature.action}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-3 rounded-full ${feature.color}`}>
                                                    <feature.icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-2">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Access */}
                <Card>
                    <CardHeader>
                        <CardTitle>Akses Cepat</CardTitle>
                        <CardDescription>
                            Navigasi cepat ke bagian yang sering digunakan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => router.visit('/')}
                                className="flex items-center space-x-2"
                            >
                                <Droplets className="h-4 w-4" />
                                <span>Halaman Utama</span>
                            </Button>
                            
                            {user.role === 'hr_admin' && (
                                <Button 
                                    variant="outline"
                                    onClick={() => router.visit('/admin/employees')}
                                    className="flex items-center space-x-2"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Data Karyawan</span>
                                </Button>
                            )}
                            
                            {(user.role === 'administrator' || user.role === 'warehouse_admin') && (
                                <Button 
                                    variant="outline"
                                    onClick={() => router.visit('/admin/requests')}
                                    className="flex items-center space-x-2"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    <span>Permintaan</span>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}