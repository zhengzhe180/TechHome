import Layout from '@/layout'

const flatRouter = {
  path: '/flat',
  component: Layout,
  redirect: '/flat/complaint/big-screen',
  name: 'FlatManagement',
  meta: {
    title: '扁平化管理',
    icon: 'el-icon-s-grid',
    roles: ['admin', 'manager'] // you can set roles in root nav
  },
  children: [
    {
      path: 'complaint',
      component: () => import('@/views/flat/complaint/index'),
      name: 'Complaint',
      meta: { title: '投诉' },
      children: [
        {
          path: 'big-screen',
          component: () => import('@/views/flat/complaint/bigScreen/index'),
          name: 'ComplaintBigScreen',
          meta: { title: '大屏' }
        },
        {
          path: 'pending-dispatch',
          component: () => import('@/views/flat/complaint/pendingDispatch/index'),
          name: 'ComplaintPendingDispatch',
          meta: { title: '待调度工单' }
        }
      ]
    },
    {
      path: 'installation',
      component: () => import('@/views/flat/installation/index'),
      name: 'Installation',
      meta: { title: '装机' },
      children: [
        {
          path: 'big-screen',
          component: () => import('@/views/flat/installation/bigScreen/index'),
          name: 'InstallationBigScreen',
          meta: { title: '大屏' },
          redirect: '/flat/installation/big-screen/county',
          children: [
            {
              path: 'county',
              component: () => import('@/views/flat/installation/bigScreen/county/index'),
              name: 'CountyLevel',
              meta: { title: '区县粒度' }
            },
            {
              path: 'grid',
              component: () => import('@/views/flat/installation/bigScreen/grid/index'),
              name: 'GridLevel',
              meta: { title: '网格粒度' }
            },
            {
              path: 'technician',
              component: () => import('@/views/flat/installation/bigScreen/technician/index'),
              name: 'TechnicianLevel',
              meta: { title: '装维粒度' }
            }
          ]
        },
        {
          path: 'work-order-inquiry',
          component: () => import('@/views/flat/installation/work-order-inquiry/index'),
          name: 'WorkOrderInquiry',
          meta: { title: '工单查询' },
          redirect: '/flat/installation/work-order-inquiry/accumulated',
          children: [
            {
              path: 'accumulated',
              component: () => import('@/views/flat/installation/work-order-inquiry/accumulated'),
              name: 'InstallationAccumulated',
              meta: { title: '装机工单(累计)' }
            },
            {
              path: 'cleared',
              component: () => import('@/views/flat/installation/work-order-inquiry/cleared'),
              name: 'InstallationCleared',
              meta: { title: '装机工单(清零)' }
            },
            {
              path: 'word-cui',
              component: () => import('@/views/flat/installation/work-order-inquiry/word-cui-orders'),
              name: 'WordCui',
              meta: { title: '催字工单(累计)' }
            },
            {
              path: 'urgent',
              component: () => import('@/views/flat/installation/work-order-inquiry/urgent-unarchived-orders'),
              name: 'InstallationUrgentUnarchivedOrders',
              meta: { title: '投诉关联工单(未归档)' }
            },
            {
              path: 'manual-judgment-red-yellow',
              component: () => import('@/views/flat/installation/work-order-inquiry/manual-judgment-red-yellow-orders'),
              name: 'RedYellowForm',
              meta: { title: '手写判断/红黄单' }
            },
            {
              path: 'site-verification',
              component: () => import('@/views/flat/installation/work-order-inquiry/zw-site-verification-orders'),
              name: 'SiteVerification',
              meta: { title: '装维选址/核实单' }
            },
            {
              path: 'tomorrow',
              component: () => import('@/views/flat/installation/work-order-inquiry/tomorrow'),
              name: 'InstallationTomorrow',
              meta: { title: '明日装机工单' }
            }
          ]
        }
      ]
    }
  ]
}
export default flatRouter
