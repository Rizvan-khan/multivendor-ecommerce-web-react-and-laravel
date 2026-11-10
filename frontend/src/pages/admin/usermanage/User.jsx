import React from 'react'
import Customtable from '../../tables/CustomTable';
import { api, getApiError } from '../../../api/https'; 

const columns = [
  { header: 'ID', accessor: 'id', width: 70 },
  { header: 'first Name', accessor: 'firstName', width: 130 },
   { header: 'last Name', accessor: 'lastName', width: 100 },
   { header: 'email', accessor: 'email', width: 130 },
    { header: 'mobile', accessor: 'mobile', width: 130 },
     { header: 'role', accessor: 'role', width: 130 },
     {
      header: 'Action',
      render: () => (
        <button
         
          className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
        >
          Edit 
        </button>
      ),
    },
];

const data = [
    {
        id: 1,
        firstName: "Rizvan",
        lastName : "khan",
        email: "rizvan@example.com",
        mobile: "1234567890",
        "role": "admin",

    }
];

const User = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black-200">User Management</h2>
      <Customtable columns={columns} data={data}/>
    </div>
  )
}

export default User