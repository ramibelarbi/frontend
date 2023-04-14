export default function AuthHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    const header = { Authorization: 'Bearer ' + user.token };
    console.log('Header with token:', header);
    return header;
  } else {
    console.log('No token found.');
    return {};
  }
}