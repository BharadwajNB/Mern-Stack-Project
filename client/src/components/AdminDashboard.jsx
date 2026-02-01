import FacultyDashboard from './FacultyDashboard';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <div className="admin-banner">
                <div className="banner-icon">👑</div>
                <div className="banner-content">
                    <h2>Admin Panel</h2>
                    <p>Full access to all complaints across departments</p>
                </div>
            </div>
            <FacultyDashboard />

            <style>{`
                .admin-banner {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: linear-gradient(135deg, var(--color-primary-light), var(--color-bg-tertiary));
                    border: 1px solid var(--color-primary);
                    border-radius: var(--radius-lg);
                    padding: 1rem 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .banner-icon {
                    font-size: 2rem;
                }

                .banner-content h2 {
                    margin: 0;
                    font-size: 1.125rem;
                    color: var(--color-text-primary);
                }

                .banner-content p {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
