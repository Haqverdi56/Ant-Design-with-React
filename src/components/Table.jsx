import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';



const App = () => {
    const [orders, setOrders] = useState([])

    const fillData = () => {
        fetch('https://northwind.vercel.app/api/orders')
        .then(res=>res.json())
        .then(res=>{
            setOrders(res)
            console.log(res);
        })
    }
    useEffect(() => {
      fillData()
    }, [])
    

    const columns = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'CustomerID',
          dataIndex: 'customerId',
          key: 'customerId',
        },
        {
          title: 'Order Date',
          dataIndex: 'orderDate',
          key: 'orderDate',
        },
        {
          title: 'Ship via',
          dataIndex: 'shipVia',
          key: 'shipVia',
        },
        {
          title: 'Button',
          key: 'button',
          render: id => (
            <Button>Delete</Button>
          )
        },
      ];
    return (
        <>
        <div>
        <Table columns={columns} dataSource={orders} pagination={{ pageSize: 5 }}/>
        </div>
        </>
    )
};
export default App;