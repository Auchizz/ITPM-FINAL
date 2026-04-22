import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import userApi from '../api/userApi'

export default function UserManagementPage(){
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    try{ const data = await userApi.getUsers(); setUsers(data || []) }catch(e){ console.error(e) }
  }

  async function removeUser(id){
    if(!confirm('Delete user?')) return
    try{ await userApi.deleteUser(id); load() }catch(e){console.error(e)}
  }

  const filtered = users.filter(u => {
    if(roleFilter && u.role !== roleFilter) return false
    if(query && !`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">User Management</h3>
              <div className="flex gap-2">
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users..." className="px-3 py-2 border rounded-lg" />
                <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                  <option value="">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-slate-500 text-sm">
                  <tr>
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Faculty</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u=> (
                    <tr key={u._id || u.id} className="hover:bg-slate-50">
                      <td className="py-2">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.studentId}</td>
                      <td>{u.faculty}</td>
                      <td><span className={`px-2 py-1 rounded text-sm ${u.role==='admin'?'bg-primary text-white':'bg-slate-100'}`}>{u.role}</span></td>
                      <td>
                        <button className="px-3 py-1 mr-2 rounded bg-slate-100">Edit Role</button>
                        <button onClick={()=>removeUser(u._id || u.id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
