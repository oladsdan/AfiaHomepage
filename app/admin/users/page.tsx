import { PageHeader } from "../components/PageHeader";
import { UsersTable } from "../components/UsersTable";

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Search, browse and manage all registered accounts"
      />
      <UsersTable />
    </div>
  );
}
