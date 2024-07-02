import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, InputNumber, Empty } from 'antd'

import Header from '@/components/Header';
import Category from '@/components/Category';
import ColourBox from '@/components/CreateProductPage/ColourBox';
import SizeBox from '@/components/CreateProductPage/SizeBox';
import CKeditor from '@/components/CKEditor';
import RowProductVariant from '@/components/CreateProductPage/RowProductVariant';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'
import { Router, useRouter } from 'next/router';

const UpdateProduct = () => {
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('')
    const [selectedColours, setSelectedColours] = useState([]);
    const [colourBoxValue, setColourBoxValue] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sizeBoxValue, setSizeBoxValue] = useState([]);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [colorText, setColorText] = useState("");
    const [sizeText, setSizeText] = useState("");
    const [images, setImages] = useState([]);
    const [productID, setProductID] = useState(-1);
    const [previews, setPreviews] = useState([]);
    const [listImage, setListImage] = useState([]);

    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);

    const router = useRouter();

    const { product_id } = router.query;

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${homeAPI}/product/admin/detail/${product_id}`)
                if (res.data) {
                    setProductName(res.data.name)
                    setCategoryId(res.data.categoryID)
                    setPrice(res.data.price)
                    setCategoryName(res.data.CategoryName)
                    setDescription(res.data.description)
                    setProductID(res.data.productID)
                    setColorText(res.data.productVariantList[0].colour)
                    setSizeText(res.data.productVariantList[0].size)
                    setPreviews(res?.data?.productPictures?.map(item => item.path.replace(item.path.split("/")[2], `localhost:${process.env.NEXT_PUBLIC_BACKEND_URL_PORT}`)))
                    setListImage(res?.data?.productPictures?.map(item => item.path.replace(item.path.split("/")[2], `localhost:${process.env.NEXT_PUBLIC_BACKEND_URL_PORT}`)))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch();
    }, [])

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        let productVariantListTemp = [];
        for (let i in selectedColours) {
            for (let y in selectedSizes) {
                let productVariant = {
                    colour_id: selectedColours[i].colour_id,
                    colour_name: selectedColours[i].colour_name,
                    size_id: selectedSizes[y].size_id,
                    size_name: selectedSizes[y].size_name,
                    quantity: '',
                    fileList: []
                }
                productVariantListTemp.push(productVariant);
            }
        }
        setProductVariantList(productVariantListTemp);

    }, [selectedColours, selectedSizes]);

    useEffect(() => {
        let rowProductVariantTemp = [];
        for (let i in productVariantList) {
            rowProductVariantTemp.push(
                <RowProductVariant
                    key={i}
                    index={i}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                />
            );
        }
        setRowProductVariant(rowProductVariantTemp);
    }, [productVariantList]);

    const createProduct = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let newProduct = {
                    productID: productID,
                    name: productName,
                    price,
                    categoryID: categoryId,
                    description,
                    productPictures: images,
                    listImages: listImage
                }
                let result = await axios.put(`${homeAPI}/product/update`, newProduct, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setIsLoading(false)
                swtoast.success({ text: 'Sửa sản phẩm thành công!' })
            } catch (err) {
                console.log(err);
            }
        }
    }

    const Validate = () => {
        if (!productName) {
            swtoast.error({ text: 'Tên sản phẩm không được bỏ trống' })
            return false
        }
        if (!categoryId) {
            swtoast.error({ text: 'Danh mục sản phẩm không được bỏ trống' })
            return false
        }
        if (!price) {
            swtoast.error({ text: 'Giá sản phẩm không được bỏ trống' })
            return false
        }
        if (!description) {
            swtoast.error({ text: 'Mô tả sản phẩm không được bỏ trống' })
            return false
        }
        if (!colorText) {
            swtoast.error({ text: 'Color sản phẩm không được bỏ trống' })
            return false
        }
        if (!sizeText) {
            swtoast.error({ text: 'Size sản phẩm không được bỏ trống' })
            return false
        }
        for (const productVariant of productVariantList) {
            if (!productVariant.quantity) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một tồn kho' })
                return false
            }
            if (!productVariant.fileList.length) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một ảnh' })
                return false
            }
        }
        return true
    }

    const clearPage = () => {
        setProductName('')
        setCategoryId('')
        setCategoryName('')
        setPrice(0)
        setDescription('')
        setProductVariantList([])
        setSelectedColours([])
        setColourBoxValue([])
        setSelectedSizes([])
        setSizeBoxValue([])
        setSizeText("")
        setColorText("")
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const newPreviews = files.map(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prevState => [...prevState, reader.result]);
            };
            reader.readAsDataURL(file);
            return reader.result;
        });
    };

    const handleDeleteImage = (link) => {
        setListImage(prev => prev.filter(image => image !== link))
        setPreviews(prev => prev.filter(image => image !== link))
    }

    return (
        <div className='create-product-page'>
            <Header title="Chỉnh sửa sản phẩm" />
            <div className="create-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                        <Input
                            id='product-name' placeholder='Nhập tên sản phẩm'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                </div>
                {/* // Component danh muc */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-category' className="fw-bold">Danh mục:</label>
                        <Category setCategoryId={setCategoryId} categoryName={categoryName} setCategoryName={setCategoryName} />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-price' className="fw-bold">Giá sản phẩm:</label>
                        <br />
                        <InputNumber
                            id='product-price' placeholder='Nhập giá sản phẩm'
                            value={price === 0 ? null : price}
                            style={{ width: '100%' }}
                            onChange={setPrice}
                        />
                    </div>
                </div>
                {/* // Mo ta san pham = CKEditor */}
                <div className="description">
                    <label htmlFor='description' className="fw-bold">Mô tả sản phẩm:</label>
                    <div className="ckeditor-box">
                        <CKeditor
                            Placeholder={{ placeholder: "Mô tả ..." }}
                            name="description"
                            id="description"
                            form="add-product-form"
                            data={description}
                            onChange={(data) => {
                                setDescription(data);
                            }}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-color' className="fw-bold">Màu:</label>
                        <Input
                            disabled
                            id='product-color' placeholder='Nhập màu sản phẩm'
                            value={colorText}
                            onChange={(e) => setColorText(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-size' className="fw-bold">Size:</label>
                        <Input
                            disabled
                            id='product-name' placeholder='Nhập size sản phẩm'
                            value={sizeText}
                            onChange={(e) => setSizeText(e.target.value)}
                        />
                    </div>
                </div>
                <div className='mt-4'>
                    <label htmlFor='product-file' className="fw-bold">Chọn ảnh:</label>
                    <input type="file" id='product-file' accept="image/*" className='form-control' multiple onChange={handleImageChange} />
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                        {previews.map((preview, index) => (
                            <div key={index} style={{ margin: '10px', position: 'relative' }}>
                                <button style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }} className='btn btn-primary' onClick={() => handleDeleteImage(preview)}>
                                    Xóa
                                </button>
                                <img src={preview} alt={`Preview ${index}`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* dung Selected colour va Seleted size de tao bang Product-Variant */}
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={createProduct}>
                        Chỉnh sửa sản phẩm
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div >
    )
}

export default UpdateProduct