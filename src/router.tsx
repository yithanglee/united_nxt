import React, { Suspense } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import AuthenticatedLayout from '@/app/(authenticated)/layout'

// Lazy load pages
const LandingPage = React.lazy(() => import('@/app/page'))
const LoginPage = React.lazy(() => import('@/app/login/page'))
const SignUpPage = React.lazy(() => import('@/app/signup/page'))

// Authenticated pages
const DashboardPage = React.lazy(() => import('@/app/(authenticated)/dashboard/page'))
const StatisticPage = React.lazy(() => import('@/app/(authenticated)/statistic/page'))
const LoansPage = React.lazy(() => import('@/app/(authenticated)/loans/page'))
const LoansHistoryPage = React.lazy(() => import('@/app/(authenticated)/loans/history/page'))
const BooksPage = React.lazy(() => import('@/app/(authenticated)/books/page'))
const AuthorsPage = React.lazy(() => import('@/app/(authenticated)/authors/page'))
const PublishersPage = React.lazy(() => import('@/app/(authenticated)/publishers/page'))
const BookSourcesPage = React.lazy(() => import('@/app/(authenticated)/book_sources/page'))
const CategoriesPage = React.lazy(() => import('@/app/(authenticated)/categories/page'))
const CategoryInventoriesPage = React.lazy(
  () => import('@/app/(authenticated)/categories/[book_category_id]/book_inventories/page')
)
const ScanPage = React.lazy(() => import('@/app/(authenticated)/scan/page'))
const UploadPage = React.lazy(() => import('@/app/(authenticated)/upload/page'))
const OrganizationsPage = React.lazy(() => import('@/app/(authenticated)/organizations/page'))
const SmtpSettingsPage = React.lazy(() => import('@/app/(authenticated)/smtp_settings/page'))
const UsersPage = React.lazy(() => import('@/app/(authenticated)/users/page'))
const MembersPage = React.lazy(() => import('@/app/(authenticated)/members/page'))
const GroupsPage = React.lazy(() => import('@/app/(authenticated)/groups/page'))
const RolesPage = React.lazy(() => import('@/app/(authenticated)/roles/page'))
const RoleAppRoutesPage = React.lazy(
  () => import('@/app/(authenticated)/roles/[id]/app_routes/page')
)
const AppRoutesPage = React.lazy(() => import('@/app/(authenticated)/app_routes/page'))
const ProfilePage = React.lazy(() => import('@/app/(authenticated)/profile/page'))
const MembershipPackagesPage = React.lazy(
  () => import('@/app/(authenticated)/membership_packages/page')
)
const TagsPage = React.lazy(() => import('@/app/(authenticated)/tags/page'))
const VariantsPage = React.lazy(() => import('@/app/(authenticated)/variants/page'))
const VariantPricesPage = React.lazy(
  () => import('@/app/(authenticated)/variants/[variant_id]/prices/page')
)
const ProductsPage = React.lazy(() => import('@/app/(authenticated)/products/page'))

function PageFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
    </div>
  )
}

function withSuspense(Component: React.ComponentType<any>, extraProps: Record<string, any> = {}) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component {...extraProps} />
      </Suspense>
    )
  }
}

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  ),
})

// Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withSuspense(LandingPage),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: withSuspense(LoginPage),
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: withSuspense(SignUpPage),
})

// Authenticated Layout Route
const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: () => (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ),
})

// Authenticated Child Routes
const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/dashboard',
  component: withSuspense(DashboardPage),
})

const statisticRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/statistic',
  component: withSuspense(StatisticPage),
})

const loansRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/loans',
  component: withSuspense(LoansPage),
})

const loansHistoryRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/loans/history',
  component: withSuspense(LoansHistoryPage),
})

const booksRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/books',
  component: () => {
    return (
      <Suspense fallback={<PageFallback />}>
        <BooksPage params={{ book_category_id: '' }} />
      </Suspense>
    )
  },
})

const authorsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/authors',
  component: withSuspense(AuthorsPage),
})

const publishersRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/publishers',
  component: withSuspense(PublishersPage),
})

const bookSourcesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/book_sources',
  component: withSuspense(BookSourcesPage),
})

const categoriesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/categories',
  component: withSuspense(CategoriesPage),
})

const categoryInventoriesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/categories/$book_category_id/book_inventories',
  component: () => {
    const params = categoryInventoriesRoute.useParams()
    return (
      <Suspense fallback={<PageFallback />}>
        <CategoryInventoriesPage params={{ book_category_id: params.book_category_id }} />
      </Suspense>
    )
  },
})

const scanRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/scan',
  component: withSuspense(ScanPage),
})

const uploadRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/upload',
  component: withSuspense(UploadPage),
})

const organizationsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/organizations',
  component: withSuspense(OrganizationsPage),
})

const smtpSettingsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/smtp_settings',
  component: withSuspense(SmtpSettingsPage),
})

const usersRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/users',
  component: withSuspense(UsersPage),
})

const membersRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/members',
  component: withSuspense(MembersPage),
})

const groupsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/groups',
  component: withSuspense(GroupsPage),
})

const rolesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/roles',
  component: withSuspense(RolesPage),
})

const roleAppRoutesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/roles/$id/app_routes',
  component: () => {
    const params = roleAppRoutesRoute.useParams()
    return (
      <Suspense fallback={<PageFallback />}>
        <RoleAppRoutesPage params={{ id: params.id }} />
      </Suspense>
    )
  },
})

const appRoutesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/app_routes',
  component: withSuspense(AppRoutesPage),
})

const profileRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/profile',
  component: withSuspense(ProfilePage),
})

const membershipPackagesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/membership_packages',
  component: withSuspense(MembershipPackagesPage),
})

const tagsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/tags',
  component: withSuspense(TagsPage),
})

const variantsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/variants',
  component: withSuspense(VariantsPage),
})

const variantPricesRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/variants/$variant_id/prices',
  component: () => {
    const params = variantPricesRoute.useParams()
    return (
      <Suspense fallback={<PageFallback />}>
        <VariantPricesPage params={{ variant_id: params.variant_id }} />
      </Suspense>
    )
  },
})

const productsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/products',
  component: withSuspense(ProductsPage),
})

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  authenticatedLayoutRoute.addChildren([
    dashboardRoute,
    statisticRoute,
    loansRoute,
    loansHistoryRoute,
    booksRoute,
    authorsRoute,
    publishersRoute,
    bookSourcesRoute,
    categoriesRoute,
    categoryInventoriesRoute,
    scanRoute,
    uploadRoute,
    organizationsRoute,
    smtpSettingsRoute,
    usersRoute,
    membersRoute,
    groupsRoute,
    rolesRoute,
    roleAppRoutesRoute,
    appRoutesRoute,
    profileRoute,
    membershipPackagesRoute,
    tagsRoute,
    variantsRoute,
    variantPricesRoute,
    productsRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
