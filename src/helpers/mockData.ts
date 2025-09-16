import { User } from './type';
export const UserMock = {
  "id": "user123",
  "email": "jane.doe@example.com",
  "password": "$2b$10$hashedpasswordstring",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+919876543210",
  "stealthMode": true,
  "stealthType": "calculator",
  "createdAt": "2024-12-01T08:30:00Z",
  "updatedAt": "2025-06-28T12:00:00Z"
}

export const addressMockData = [
  {
    "id": "addr1",
    "userId": "user123",
    "type": "Home",
    "street": "221B Baker Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "radiusMeters": 200,
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-06-25T12:00:00Z"
  }
]

export const contactData = [
  {
    "id": "contact1",
    "userId": "user123",
    "name": "John Doe",
    "phoneNumber": "+919812345678",
    "relationship": "Brother",
    "email": "john.doe@example.com",
    "createdAt": "2025-02-10T09:00:00Z",
    "updatedAt": "2025-06-20T10:00:00Z"
  },
  {
    "id": "contact2",
    "userId": "user123",
    "name": "Mom",
    "phoneNumber": "+919833334444",
    "relationship": "Mother",
    "email": "mom@example.com",
    "createdAt": "2025-03-01T08:45:00Z",
    "updatedAt": "2025-06-15T11:30:00Z"
  }
]

export const safetyTimerData = [
  {
    "id": "timer1",
    "userId": "user123",
    "duration": 900, // 15 minutes
    "expiresAt": "2025-06-28T18:45:00Z",
    "isActive": false,
    "sharedLocation": true,
    "createdAt": "2025-06-28T18:30:00Z",
    "updatedAt": "2025-06-28T18:45:01Z"
  },
  {
    "id": "timer2",
    "userId": "user123",
    "duration": 1800, // 30 minutes
    "expiresAt": "2025-06-29T12:30:00Z",
    "isActive": true,
    "sharedLocation": false,
    "createdAt": "2025-06-29T12:00:00Z",
    "updatedAt": "2025-06-29T12:00:00Z"
  }
]

export const sosData = [
  {
    "id": "sos1",
    "userId": "user123",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "triggeredAt": "2025-06-27T21:30:00Z",
    "resolved": true
  },
  {
    "id": "sos2",
    "userId": "user123",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "triggeredAt": "2025-06-28T19:45:00Z",
    "resolved": false
  }
]

