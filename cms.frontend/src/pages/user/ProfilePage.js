import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/userService";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form dữ liệu người dùng
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });

  // Form địa chỉ
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    buildingName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [editingAddress, setEditingAddress] = useState(null);

  // 🧠 Load dữ liệu hồ sơ người dùng
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      if (!currentUser) {
        setError("⚠️ Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      const data = await userService.getUserById(currentUser.userId);
      setProfile(data);

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobileNumber: data.mobileNumber || "",
        email: data.email || "",
      });

      // ✅ Lấy danh sách địa chỉ từ API riêng (chuẩn nhất)
      const addr = await userService.getUserAddresses(currentUser.userId);
      setAddresses(addr);

    } catch (err) {
      console.error(err);
      setError("❌ Lỗi tải hồ sơ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [currentUser]);



  // 📩 Cập nhật hồ sơ người dùng
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.updateUserProfile(profile.userId, formData);
      setProfile(updated);
      setIsEditing(false);
      alert("✅ Cập nhật hồ sơ thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Không thể cập nhật thông tin người dùng.");
    }
  };

  // 🏠 Thêm hoặc sửa địa chỉ
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const updated = await userService.updateAddress(
          profile.userId,
          editingAddress.addressId,
          addressForm
        );
        setAddresses((prev) =>
          prev.map((a) => (a.addressId === updated.addressId ? updated : a))
        );
        alert("✅ Cập nhật địa chỉ thành công!");
      } else {
        const added = await userService.addAddress(profile.userId, addressForm);
        setAddresses((prev) => [...prev, added]);
        alert("✅ Đã thêm địa chỉ mới!");
      }
      setShowAddressForm(false);
    } catch (err) {
      console.error(err);
      alert("❌ Không thể lưu địa chỉ.");
    }
  };

  // 🗑️ Xóa địa chỉ
  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        await userService.deleteAddress(profile.userId, id);
        setAddresses((prev) => prev.filter((a) => a.addressId !== id));
        alert("🗑️ Đã xóa địa chỉ thành công.");
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi xóa địa chỉ.");
      }
    }
  };

  if (loading) return <div className="loading">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container container py-4">
      {/* ====================== Thông tin người dùng ====================== */}
      <div className="profile-card shadow-sm p-4 mb-5 bg-white rounded">
        <h2 className="text-success fw-bold mb-4">👤 Hồ sơ người dùng</h2>

        {!isEditing ? (
          <>
            <p><strong>Họ:</strong> {profile.firstName}</p>
            <p><strong>Tên:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Số điện thoại:</strong> {profile.mobileNumber}</p>

            <button
              className="btn btn-primary mt-3"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Chỉnh sửa hồ sơ
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Họ</label>
                <input
                  className="form-control"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tên</label>
                <input
                  className="form-control"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-control"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success w-50" type="submit">
                💾 Lưu
              </button>
              <button
                type="button"
                className="btn btn-secondary w-50"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ====================== Địa chỉ giao hàng ====================== */}
      <div className="address-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary">🏠 Địa chỉ giao hàng</h3>
          <button
            className="btn btn-outline-success"
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
              setAddressForm({
                buildingName: "",
                street: "",
                city: "",
                state: "",
                country: "",
                pincode: "",
              });
            }}
          >
            ➕ Thêm địa chỉ
          </button>
        </div>

        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <div key={addr.addressId} className="address-card shadow-sm p-3 mb-3 rounded">
              <p>
                <strong>{addr.buildingName}</strong> - {addr.street}
              </p>
              <p>
                {addr.city}, {addr.state}, {addr.country} ({addr.pincode})
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setEditingAddress(addr);
                    setAddressForm(addr);
                    setShowAddressForm(true);
                  }}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteAddress(addr.addressId)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Chưa có địa chỉ nào được lưu.</p>
        )}

        {/* Form thêm/sửa địa chỉ */}
        {showAddressForm && (
          <form className="address-form mt-4" onSubmit={handleAddressSubmit}>
            <h5>
              {editingAddress ? "✏️ Chỉnh sửa địa chỉ" : "➕ Thêm địa chỉ mới"}
            </h5>
            {Object.keys(addressForm).map((key) => (
              <div className="mb-2" key={key}>
                <label className="form-label text-capitalize">{key}</label>
                <input
                  className="form-control"
                  value={addressForm[key]}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success w-50" type="submit">
                💾 Lưu
              </button>
              <button
                type="button"
                className="btn btn-secondary w-50"
                onClick={() => setShowAddressForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
