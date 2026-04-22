import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import activityApi from '../api/activityApi'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')

  async function loadNotifications() {
    try {
      const data = await activityApi.getNotifications()
      setNotifications(data)
    } catch (loadError) {
      setError('Unable to load notifications.')
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markRead = async (id) => {
    await activityApi.markNotificationRead(id)
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const markAllRead = async () => {
    await activityApi.markAllNotificationsRead()
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="space-y-6 px-4 py-6 md:px-8">
          <section className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">My Part</div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-primary">Notification System</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f675d]">
                  Notifications for participation and feedback are managed here in a separate page, without changing the sports module pages.
                </p>
              </div>
              {unreadCount > 0 ? <button className="btn-primary" onClick={markAllRead}>Mark All Read</button> : null}
            </div>
          </section>

          {error ? <div className="rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{error}</div> : null}

          <section className="card">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Inbox</div>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">My Notifications</h3>

            <div className="mt-6 space-y-4">
              {notifications.length > 0 ? notifications.map((item) => (
                <article key={item.id} className={`rounded-[24px] border p-4 ${item.read ? 'border-[#eee3d3] bg-[#f8f1e7]/80' : 'border-[#d8c6ab] bg-[#fff8ef]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-primary">{item.title}</div>
                      <p className="mt-2 text-sm leading-6 text-[#6f675d]">{item.message}</p>
                      <div className="mt-3 text-xs uppercase tracking-[0.24em] text-[#8c7d69]">{new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                    {!item.read ? (
                      <button className="inline-flex items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-primary" onClick={() => markRead(item.id)}>
                        Mark Read
                      </button>
                    ) : (
                      <div className="badge">Read</div>
                    )}
                  </div>
                </article>
              )) : (
                <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 text-sm text-[#6f675d]">
                  No notifications yet.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
