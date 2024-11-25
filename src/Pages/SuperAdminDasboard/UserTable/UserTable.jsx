import React from 'react';
import styles from './usertable.module.css';
import { useAuth } from '../../../Store/FirebaseAuth';

const UserTable = ({ users, onDeleteUser, onUpdateRole, onToggleDisable, currentUserRole }) => {

  const { role } = useAuth();

  // Handle change in role dropdown
  const handleRoleChange = (e, userId) => {
    const newRole = e.target.value;
    onUpdateRole(userId, newRole); // Update role when changed
  };

  const handleDisableToggle = (userId, isDisabled) => {
    onToggleDisable(userId, !isDisabled); // Toggle the disabled state
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Name</th>
          <th>Number of Posts</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td style={{ textAlign: "left" }}>{user.name}</td>
            <td>{user.postsCreated || 0}</td>
            <td>
              {/* Dropdown to edit role, visible only to superadmins */}
              {role.toLowerCase() === 'superadmin' ? (
                <select
                  onChange={(e) => handleRoleChange(e, user.id)} // Handle role change
                  value={user.role}
                  disabled={user.role.toLowerCase() === "superadmin"} // Disable for superadmins
                >
                  <option disabled>{user.role}</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              ) : (
                <span className={styles.rolesAdmin}>{user.role}</span> // Just display the role for admins
              )}
            </td>
            <td className={styles.deleteDisableBtns}>
              {/* Button to toggle disable/enable, visible only to superadmins */}
              {role.toLowerCase() === 'superadmin' ? (
                <button
                  className={user.disabled ? styles.disableButton : styles.enableButton}
                  onClick={() => handleDisableToggle(user.id, user.disabled)}
                  disabled={user.role.toLowerCase() === 'superadmin'}
                >
                  {user.disabled ? 'Enable' : 'Disable'}
                </button>
              ) : <span className={styles.enableDisableAdmin}>{user.disabled ? "disabled" : "enabled"}</span>}

              {/* Button to delete user, visible only to superadmins */}
              {role.toLowerCase() === 'superadmin' && (
                <button
                  className={styles.deleteButton}
                  onClick={() => onDeleteUser(user.id)}
                  disabled={user.role.toLowerCase() === 'superadmin'}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
