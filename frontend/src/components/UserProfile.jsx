import React, { useState, useEffect } from 'react';
import '../styles/userProfile.css';

const UserProfile = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('manemade_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [address] = useState(() => {
        const savedAddr = localStorage.getItem('manemade_delivery_address');
        return savedAddr ? JSON.parse(savedAddr) : null;
    });

    if (!user) {
        return (
            <div className="profile-container">
                <div className="profile-card error-card">
                    <h2>Please login to view your profile</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card simple-profile">
                <div className="profile-avatar-large">
                    {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                
                <h1 className="profile-name-title">{user.firstName} {user.lastName}</h1>
                <p className="profile-subtitle">Personal Account Details</p>

                <div className="profile-details-list">
                    <div className="detail-item">
                        <label>Full Name</label>
                        <div className="detail-value">{user.firstName} {user.lastName}</div>
                    </div>
                    
                    <div className="detail-item">
                        <label>Email Address</label>
                        <div className="detail-value">{user.email}</div>
                    </div>
                    
                    <div className="detail-item">
                        <label>Mobile Number</label>
                        <div className="detail-value">{user.phone || (address && address.phone) || 'Not provided'}</div>
                    </div>

                    <div className="detail-item">
                        <label>Saved Address</label>
                        <div className="detail-value address-value">
                            {address ? `${address.address}, ${address.city} - ${address.pincode}` : 'No address saved yet'}
                        </div>
                    </div>
                </div>

                <div className="profile-footer">
                    <button className="edit-profile-btn disabled">Edit Profile</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
