import { Carousel } from 'antd';
import Image from 'next/image';

const CarouselFade = ({ imageList }) => {
    return (
        <Carousel>
            {imageList &&
                imageList.map((image, index) => {
                    return (
                        <div key={index}>
                            <div className="position-relative" style={{ paddingTop: '150%' }}>
                                <Image className="rounded" src={image} fill alt={index} />
                            </div>
                        </div>
                    );
                })}
        </Carousel>
    );
};

export default CarouselFade;
