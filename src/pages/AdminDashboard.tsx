import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Enquiry, Cake } from '../types';
import toast from 'react-hot-toast';
import { Upload, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCake, setShowAddCake] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(['']);
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    category: 'cheesecakes',
    images: [''],
    featured: false
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'created_at', 
    direction: 'desc' 
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      fetchEnquiries();
    };

    checkAuth();
  }, [navigate]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          cakes (
            name,
            category
          )
        `)
        .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });

      if (error) throw error;

      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig.key) {
      fetchEnquiries();
    }
  }, [sortConfig]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('cake-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cake-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }

    setUploadedImages([...uploadedImages, ...newImages]);
    setNewCake({ ...newCake, images: [...uploadedImages, ...newImages] });
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setNewCake({ ...newCake, images: updatedImages });
  };

  const handleAddCake = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('cakes')
        .insert([{
          ...newCake,
          images: uploadedImages.filter(img => img !== '')
        }]);

      if (error) throw error;

      toast.success('Cake added successfully!');
      setShowAddCake(false);
      setNewCake({
        name: '',
        description: '',
        category: 'cheesecakes',
        images: [''],
        featured: false
      });
      setUploadedImages(['']);
    } catch (error) {
      toast.error('Failed to add cake');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Name', 'Email', 'Phone', 'Cake', 'Category', 'Message'],
      ...enquiries.map(e => [
        new Date(e.created_at).toLocaleDateString(),
        e.name,
        e.email,
        e.phone,
        e.cakes?.name || '',
        e.cakes?.category || '',
        e.message
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Enquiries exported successfully');
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddCake(true)}
              className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-5 py-2.5 rounded-lg hover:from-pink-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              Add New Cake
            </button>
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-5 py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              Export Enquiries
            </button>
          </div>
        </div>

        {showAddCake && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add New Cake</h2>
                <button 
                  onClick={() => setShowAddCake(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddCake} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newCake.name}
                    onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCake.description}
                    onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newCake.category}
                    onChange={(e) => setNewCake({ ...newCake, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all appearance-none bg-white"
                  >
                    <option value="cheesecakes">Cheesecakes</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="red-velvet">Red Velvet</option>
                    <option value="fruit">Fruit</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="cursor-pointer bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-pink-600 transition-all shadow flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedImages.map((img, index) => (
                      img && (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newCake.featured}
                    onChange={(e) => setNewCake({ ...newCake, featured: e.target.checked })}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 h-5 w-5"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Featured Cake
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCake(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-5 py-2.5 rounded-lg hover:from-pink-700 hover:to-pink-600 transition-all shadow-md"
                  >
                    Add Cake
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Enquiries</h2>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No enquiries found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('created_at')}
                    >
                      <div className="flex items-center">
                        Date
                        {getSortIcon('created_at')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cake Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enquiry.email}</div>
                        <div className="text-sm text-gray-500">{enquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enquiry.cakes?.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{enquiry.cakes?.category?.replace('-', ' ')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{enquiry.message}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
