import AdminProductTable from '@/components/admin-components/AdminProductTable';
import './admin.css';
import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <section id="amin-home">
            <div className="container admin-home-container">
                <div className="admin-home-header">
                    <div className="admin-home-header-title">
                        <h4>
                            Products
                        </h4>
                    </div>
                    <div className="admin-home-header-actions">
                        <div className="admin-home-header-action admin-home-header-search-action">
                            <div className="search-input">
                                <input className="input-group-text seach-inpt" type="text" placeholder="Search"/>
                            </div>
                        </div>
                        <div className="admin-home-header-action admin-home-header-add-action">
                            <Link href="/admin/add-product" className="btn btn-primary admin-home-header-add-act">
                              <i className="fa-solid fa-square-plus"></i>
                              Add product
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='admin-home-product-presentation'>
                    {/*
                        Here Tab and presnetation of products with table where i have Three actions (see, update, delete) and each prodcut s present with smal image comes first and then name and then description and then action (theses thre actions )
                    */}
                    <AdminProductTable />
                </div>
            </div>
        </section>
    );
  }
  