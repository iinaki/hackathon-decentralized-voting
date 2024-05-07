// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import {
//   MemoryRouter,
//   Route,
//   Routes,
//   Link,
//   matchPath,
//   useLocation,
//   Navigate,
// } from 'react-router-dom';
// import { StaticRouter } from 'react-router-dom/server';

// import Login from './Login';
// import Home from './Home';
// import Vote from './Vote';

// function Router(props: { children?: React.ReactNode }) {
//   const { children } = props;
//   if (typeof window === 'undefined') {
//     return <StaticRouter location="/drafts">{children}</StaticRouter>;
//   }

//   return (
//     <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
//       {children}
//     </MemoryRouter>
//   );
// }

// function useRouteMatch(patterns: readonly string[]) {
//   const { pathname } = useLocation();

//   for (let i = 0; i < patterns.length; i += 1) {
//     const pattern = patterns[i];
//     const possibleMatch = matchPath(pattern, pathname);
//     if (possibleMatch !== null) {
//       return possibleMatch;
//     }
//   }

//   return null;
// }

// function MyTabs() {
//   // You need to provide the routes in descendant order.
//   // This means that if you have nested routes like:
//   // users, users/new, users/edit.
//   // Then the order should be ['users/add', 'users/edit', 'users'].
//   const routeMatch = useRouteMatch(['/DVote/vote', '/DVote/home', '/DVote/login']);
//   const currentTab = routeMatch?.pattern?.path;

//   return (
//     <Tabs value={currentTab}>
//       <Tab label="Home" value="/DVote/home" to="/DVote/home" component={Link} />
//       <Tab label="Vote" value="/DVote/vote" to="/DVote/vote" component={Link} />
//     </Tabs>
//   );
// }

// function CurrentRoute() {
//     const location = useLocation();

//     if (location.pathname == '/DVote/vote') {
//         return (
//         // <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
//         //   Current route: {location.pathname}
//         // </Typography>
//         // {
//         //     location.pathname == '/DVote/vote' ? (
//         //         <Vote />}
//         //     ) : (
//         //         <Home />
//         //     )
//         // }
//         <Vote />
//         );
//     } else if (location.pathname == '/DVote/home') {
//         return (
//         <Home />
//         );
//     } else {
//         return (
//         <Login />
//         );
//     }
// }

// export default function TabsRouter() {
//   return (
//     <Router>
//       <Box sx={{ width: '100%' }}>
//         <Routes>
//             <Route path="/" element={<Navigate to="/DVote/vote" />} />
//             <Route path="*" element={<CurrentRoute />} />
//         </Routes>
//         <MyTabs />
//       </Box>
//     </Router>
//   );
// }
