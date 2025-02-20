//page to display orders, no delete function

const OrderDashboard = async () => {
  const response = await fetch("http://localhost:3001/api/orders")
  const orders = await response.json()

  console.log(orders);

  return <div> OrderDashboard</div>;
};

export default OrderDashboard;
