import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Building,
    Shield
} from 'lucide-react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    monthly_allowance: number;
    is_active: boolean;
    created_at: string;
}

interface PaginationData {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    employees: PaginationData;
    [key: string]: unknown;
}

export default function EmployeeIndex({ employees }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;

    const canManageEmployees = auth.user.role === 'hr_admin';

    const handleDelete = (employee: Employee) => {
        if (confirm(`Apakah Anda yakin ingin menghapus karyawan ${employee.name}?`)) {
            router.delete(`/admin/employees/${employee.id}`, {
                preserveState: true,
                onSuccess: () => {
                    // Handle success
                }
            });
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <span>Manajemen Karyawan</span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Kelola data karyawan dan jatah galon
                        </p>
                    </div>
                    {canManageEmployees && (
                        <Button
                            onClick={() => router.visit('/admin/employees/create')}
                            className="flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Karyawan</span>
                        </Button>
                    )}
                </div>

                {!canManageEmployees && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2 text-amber-800">
                                <Shield className="h-5 w-5" />
                                <p>Anda tidak memiliki akses untuk mengelola data karyawan. Hanya Admin HR yang dapat melakukan operasi ini.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Karyawan</CardTitle>
                        <CardDescription>
                            Total {employees.total} karyawan terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {employees.data.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Belum ada data karyawan</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {employees.data.map((employee) => (
                                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {employee.name}
                                                    </h3>
                                                    <Badge 
                                                        variant={employee.is_active ? 'default' : 'secondary'}
                                                        className={employee.is_active ? 'bg-green-100 text-green-800' : ''}
                                                    >
                                                        {employee.is_active ? 'Aktif' : 'Non-aktif'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                    <span>ID: {employee.employee_id}</span>
                                                    <span className="flex items-center space-x-1">
                                                        <Building className="h-3 w-3" />
                                                        <span>{employee.department}</span>
                                                    </span>
                                                    <span>Grade: {employee.grade}</span>
                                                    <span>Jatah: {employee.monthly_allowance} galon/bulan</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.visit(`/admin/employees/${employee.id}`)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {canManageEmployees && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.visit(`/admin/employees/${employee.id}/edit`)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(employee)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {employees.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {((employees.current_page - 1) * employees.per_page) + 1} - {Math.min(employees.current_page * employees.per_page, employees.total)} dari {employees.total} hasil
                                </div>
                                <div className="flex items-center space-x-2">
                                    {employees.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/employees?page=${employees.current_page - 1}`)}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {employees.current_page < employees.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/employees?page=${employees.current_page + 1}`)}
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