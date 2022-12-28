import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, Typography, InputNumber, Input, Form } from 'antd';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber  umber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const App = () => {
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState([])

    const fillData = () => {
      fetch('https://northwind.vercel.app/api/orders')
      .then(res=>res.json())
      .then(res=>{
        setOrders(res)
        setData(res)
        // console.log(res);
      })
    }
    useEffect(() => {
      fillData()
    }, [])
    
    const handleDelete = (key) => {
      console.log(key)
      const newData = orders.filter((item) => item.id !== key);
      setOrders(newData);
    };
    const cancel = () => {
      setEditingKey('');
    };
    
    const isEditing = (item) => item.id === editingKey;
    const edit = (item) => {
      form.setFieldValue({
        customerId: '',
        orderDate: '',
        shipVia: '',
        ...item,
      });
      setEditingKey(item.id);
    };
    const save = async (key) => {
      try {
        const row = await form.validateFields();
        console.log(row);
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          newData.push(row);
          setData(newData);
          setEditingKey('');
        } else {
          setData(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
      console.log(data);
    };
    
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
          sorter: (a, b) => a.customerId.localeCompare(b.customerId),
        },
        {
          title: 'Order Date',
          dataIndex: 'orderDate',
          key: 'orderDate',
          sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
        },
        {
          title: 'Ship via',
          dataIndex: 'shipVia',
          key: 'shipVia',
          sorter: (a, b) => a.shipVia - b.shipVia
        },
        {
          title: 'Button',
          key: 'button',
          render: item => (
            <Button>
              <Popconfirm title="Silməyəsən bəlkə?" onConfirm={() => handleDelete(item.id)}>
                Delete
              </Popconfirm>
            </Button>
          )
        },
        {
          title: 'Button',
          key: 'button',
          render: item => {
            const editable = isEditing(item);
            return editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(item.id)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(item)}>
                Edit
              </Typography.Link>
            );
          }
        },
      ];
    
    return (
      <>
        <div>
        <Table columns={columns} dataSource={orders} pagination={{ pageSize: 5 }} components={{
          body: {
            cell: EditableCell,
          },
        }}/>
        </div>
        </>
    )
};
export default App;