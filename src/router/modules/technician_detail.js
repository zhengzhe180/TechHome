import Layout from '@/layout'

const technicianDetailRouter = {
  path: '/technician_detail',
  component: Layout,
  meta: { roles: ['admin'] },
  hidden: true,
  children: [
    {
      path: 'index/:technician_id',
      name: 'TechnicianDetail',
      component: () => import('@/views/technician_detail/index'),
      meta: { title: 'Technician Detail', icon: 'user' }
    }
  ]
}

export default technicianDetailRouter
