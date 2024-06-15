import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Flex } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';

const productSchema = Joi.object().keys({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  rate: Joi.number().required(),
  price: Joi.number().required(),
  color: Joi.string().required(),
  size: Joi.string().required()
});

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectProduct, setCategory] = useState()
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    description: '',
    rate: 0,
    price: 0,
    color: '',
    size: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (product) => {
    setCategory(product)
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: token
      }
      const data = {
        title: selectProduct.title,
        subtitle: selectProduct.subtitle,
        image: selectProduct.image,
        description: selectProduct.description,
        rate: selectProduct.rate,
        price: selectProduct.price,
        color: selectProduct.color,
        size: selectProduct.size
      }
      const response = await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${selectProduct._id}`, data, {
        headers: headers
      })
      navigate(0)
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategory((categoryOld) => ({
      ...categoryOld, [name]: value
    }))
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://ecommerce-backend-fawn-eight.vercel.app/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    try {
      const { error } = productSchema.validate(form);
      if (error) {
        console.error(error);
        return;
      }
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      }
      const data = {
        title: form.title,
        subtitle: form.subtitle,
        image: form.image,
        description: form.description,
        rate: form.rate,
        price: form.price,
        size: form.size,
        color: form.color
      }
      const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/products', data, {
        headers: headers
      });
      if(response.data) {
        navigate(0)
      }
      setProducts([...products, response.data]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      }
      const response = await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${id}`, {
        headers: headers
      })
      if(response.data) {
        navigate(0)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image) => <img width={100} src={image} alt="product rasmi" />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Edit',
      dataIndex: 'editOperation',
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => showModal(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'deleteOperation',
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => handleDelete(record._id)}>
            Delete
          </Typography.Link>
        );
      },
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Create Product
      </Button>
      <Modal
        title="Create Product"
        visible={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
      >
        <Form>
          <Form.Item label="Title">
            <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value })} />
          </Form.Item>
          <Form.Item label="Subtitle">
            <Input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value })} />
          </Form.Item>
          <Form.Item label="Image">
            <Input value={form.image} onChange={(e) => setForm({...form, image: e.target.value })} />
          </Form.Item>
          <Form.Item label="Description">
            <Input value={form.description} onChange={(e) => setForm({...form, description: e.target.value })} />
          </Form.Item>
          <Form.Item label="Rate">
            <Input value={form.rate} onChange={(e) => setForm({...form, rate: e.target.value })} />
          </Form.Item>
          <Form.Item label="Price">
            <Input value={form.price} onChange={(e) => setForm({...form, price: e.target.value })} />
          </Form.Item>
          <Form.Item label="Size">
            <Input value={form.size} onChange={(e) => setForm({...form, size: e.target.value })} />
          </Form.Item>
          <Form.Item label="Color">
            <Input value={form.color} onChange={(e) => setForm({...form, color: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        title="Edit Modal" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}>
        <form action="">
          <Flex gap='middle' vertical>
            <div>
              <Input 
                placeholder='Title' 
                value={selectProduct?.title} 
                onChange={handleChange}
                name='title'
                />
            </div>
            <div>
              <Input 
                placeholder='Sub Title' 
                value={selectProduct?.subtitle} 
                onChange={handleChange}
                name='subtitle'
                />
            </div>
            <div>
              <Input 
                placeholder='Image' 
                value={selectProduct?.image}
                onChange={handleChange}
                name='image'
                />
            </div>
            <div>
              <Input 
                placeholder='Description' 
                value={selectProduct?.description}
                onChange={handleChange}
                name='description'
                />
            </div>
            <div>
              <Input 
                placeholder='Rate' 
                value={selectProduct?.rate}
                onChange={handleChange}
                name='rate'
                />
            </div>
            <div>
              <Input 
                placeholder='Price' 
                value={selectProduct?.price}
                onChange={handleChange}
                name='price'
                />
            </div>
            <div>
              <Input 
                placeholder='Color' 
                value={selectProduct?.color}
                onChange={handleChange}
                name='color'
                />
            </div>
            <div>
              <Input 
                placeholder='Size' 
                value={selectProduct?.size}
                onChange={handleChange}
                name='size'
                />
            </div>
          </Flex>
        </form>
      </Modal>
      <Table columns={columns} dataSource={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;