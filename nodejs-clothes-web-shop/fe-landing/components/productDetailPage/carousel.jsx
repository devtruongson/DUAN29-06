import { Carousel } from "antd";
import Image from "next/image";

const CarouselFade = ({ imageList }) => {
    return (
        <Carousel>
            {imageList &&
                imageList.map((image, index) => {
                    return (
                        <div key={index}>
                            <div
                                className="position-relative"
                                style={{ paddingTop: "150%" }}
                            >
                                <Image
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    className="rounded"
                                    src={image.path.replace(
                                        image.path.split("/")[2],
                                        `localhost:${process.env.NEXT_PUBLIC_BACKEND_URL_PORT}`
                                    )}
                                    fill
                                    alt={index}
                                />
                            </div>
                        </div>
                    );
                })}
        </Carousel>
    );
};

export default CarouselFade;
