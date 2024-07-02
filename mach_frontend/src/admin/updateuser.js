import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../redux/authorization";
import { toast } from "react-hot-toast";


const UpdateUserRole = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [role, setRole] = useState("");
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("User role updated successfully");
      navigate("/admin/users"); // Navigate to user list upon success
    }
    if (error) {
      toast.error("Failed to update user role");
    }
  }, [isSuccess, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ id, body: { role } });
  };

  return (
   
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4">
              <h2 className="text-center mb-4">Update User Role</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    New Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    placeholder="Enter new role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Role"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default UpdateUserRole;
