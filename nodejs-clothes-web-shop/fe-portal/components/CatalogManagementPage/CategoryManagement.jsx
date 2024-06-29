import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import CreateCategoryModal from './CreateCategoryModal'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

// const fakeListCategory = [
//     { category_id: 1, title: "Áo Nam", level: 1, parent_id: null },
//     { category_id: 2, title: "Quần Nam", level: 1, parent_id: null },
//     { category_id: 3, title: "Áo T-Shirt", level: 2, parent: "Áo Nam" },
//     { category_id: 4, title: "Áo Polo", level: 2, parent: "Áo Nam" },
//     { category_id: 5, title: "Quần Jeans", level: 2, parent: "Quần Nam" },
//     { category_id: 6, title: "Quần Short", level: 2, parent: "Quần Nam" },
// ]

const Category = () => {
    const [categoryList, setCategoryList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/list`)
                setCategoryList(result.data)
            } catch (err) {
                console.log(err)
                // setCategoryList(fakeListCategory)
            }
        }

        getAllCategory()
    }, [])

    const refreshCategoryTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/category/list')
            setCategoryList(result.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateCategoryLevel = async () => {
        const { value: newCategory } = await Swal.fire({
            title: 'Nhập tên danh mục mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên danh mục mới..',
            showCloseButton: true,
        })
        if (!newCategory) {
            swtoast.fire({
                text: "Thêm danh mục mới không thành công!"
            })
            return
        }
        if (newCategory) {
            try {
                await axios.post(homeAPI + '/category/create',
                    {
                        name: newCategory
                    })
                refreshCategoryTable()
                swtoast.success({
                    text: 'Thêm danh mục mới thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm danh mục mới vui lòng thử lại!'
                })
            }
        }
    }

    const updateCate = async (cate) => {
        const { value: newCategory } = await Swal.fire({
            title: 'Chỉnh sửa danh mục',
            input: 'text',
            inputValue: cate.name,
            inputPlaceholder: 'Tên danh mục chỉnh sửa..',
            showCancelButton: true,
        });

        if (newCategory) {
            try {
                await axios.put(homeAPI + '/category/update',
                    {
                        categoryID: cate.categoryID,
                        name: newCategory,
                    })
                refreshCategoryTable()
                swtoast.success({
                    text: 'Sửa danh mục thành công!'
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDelete = (cate) => {
        Swal.fire({
            text: "Xác nhận xóa",
            icon: "info",
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(homeAPI + '/category/delete/' + cate.categoryID)
                    refreshCategoryTable()
                    swtoast.success({
                        text: 'Xóa danh mục thành công!'
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả danh mục" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateCategoryLevel}>Tạo danh mục</button>
            </div>
            <div className='table-container' style={{ height: "520px" }}>
                <table className='table  table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>
                                Tên danh mục
                            </th>
                            <th>
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            categoryList.map((category, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <button className='btn btn-primary mx-1' onClick={() => {
                                                updateCate(category)
                                            }}>Sửa</button>
                                            <button className='btn btn-warning mx-1' onClick={() => handleDelete(category)}>Xóa</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <CreateCategoryModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    )
}

export default Category