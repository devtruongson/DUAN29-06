import Slider from '@/components/slider';
import { ArrowUpOutlined } from '@ant-design/icons';
import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="homepage">
            <div className="container-fluid g-0">
                <Slider />
            </div>
            <div className="homepage-basic container-fluid g-0">
                <div className="row g-0">
                    <div className="homepage-basic-left col-5 bg-dark text-light">
                        <h2 className="content_h2">
                            ElevenT for <br /> Runing
                        </h2>
                        <p className="content_p">
                            Sản phẩm được kiểm nghiệm bởi các vận động viên <br />
                            chạy bộ chuyên nghiệp
                        </p>
                        <div>
                            <button>Khám phá ngay</button>
                        </div>
                    </div>
                    <div className="homepage-basic-right col-7 position-relative">
                        <Image src={'/img/homepage/imgHomepageBasic.jpg'} fill alt="img-homepage-basic" />
                    </div>
                </div>
            </div>
            <div className="homepage-brands container pt-4">
                <div className="row">
                    <div className="col">
                        <div className="homepage-brands-img position-relative">
                            <Image src={'/img/homepage/homepageBrandsLeft.jpg'} fill alt="homepage-brands-left" />
                            <div className="homepage-brands-content position-absolute">
                                <h2>84Rising*</h2>
                                <p>
                                    Thương hiệu thời trang dành riêng cho giới trẻ bởi ElevenT
                                </p>
                                <div>
                                    <button>Khám phá ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="homepage-brands-img position-relative">
                            <Image src={'/img/homepage/homepageBrandsRight.jpg'} fill alt="homepage-brands-right" />
                            <div className="homepage-brands-content position-absolute">
                                <h2>CM24</h2>
                                <p>
                                    Thương hiệu chăm sóc cá nhân dành cho nam giới bởi Coolmate
                                </p>
                                <div>
                                    <button className="border-radius fw-bold">Khám phá ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-hagstag container-fluid">
                <div className="row g-0">
                    <div className="col">
                        <p>
                            CÁC SẢN PHẨM TỰ HÀO SẢN XUẤT TẠI VIỆT NAM VÀ DÀNH CHO NGƯỜI VIỆT
                            NAM! <br />
                            HƠN 3 TRIỆU SẢN PHẨM ĐÃ ĐƯỢC GỬI TỚI TAY KHÁCH HÀNG SỬ DỤNG VÀ HÀI
                            LÒNG!
                        </p>
                    </div>
                    <div className="col d-flex justify-content-around align-items-center">
                        <div>
                            <p className="hagstag-title">#ElevenT</p>
                        </div>
                        <div>
                            <p>
                                GIẢI PHÁP MUA SẮM <br />
                                CẢ TỦ ĐỒ DÀNH CHO NAM GIỚI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-service container">
                <div className="row">
                    <div className="col">
                        <div className="homepage-service-item position-relative">
                            <Image src={'/img/homepage/homepageServiceLeft.jpg'} fill alt="homepage-service-left" />
                            <div className="homepage-service-content d-flex justify-content-between align-items-center w-100">
                                <span className="title">Câu chuyện ElevenT</span>
                                <span className="title icon d-flex align-items-center">
                                    <ArrowUpOutlined />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="homepage-service-item position-relative">
                            <Image src={'/img/homepage/homepageServiceRight.jpg'} fill alt="homepage-service-right" />
                            <div className="homepage-service-content d-flex justify-content-between align-items-center w-100">
                                <span className="title">Dịch vụ hài lòng 100%</span>
                                <span className="title icon d-flex align-items-center">
                                    <ArrowUpOutlined />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
