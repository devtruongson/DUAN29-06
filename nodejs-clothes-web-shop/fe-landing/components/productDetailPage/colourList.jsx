import { useRouter } from 'next/router';
import { memo } from 'react';

import OptionButton from '@/components/productDetailPage/optionButton';

const ColourList = ({ productId, colourList, selectedColourIndex, setSelectedColourIndex }) => {
    const router = useRouter();

    return (
        <>
            {colourList &&
                colourList.map((colour, index) => {
                    return (
                        <OptionButton
                            key={index}
                            isSelected={selectedColourIndex === index}
                            content={colour.colour_name}
                            getContent={() => {
                                setSelectedColourIndex(index);
                                router.push(`/product/${productId}?colour=${colour.colour_id}`);
                            }}
                        />
                    );
                })}
        </>
    );
};

export default memo(ColourList);
