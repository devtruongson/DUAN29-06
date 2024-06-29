import { useQuery } from '@tanstack/react-query';

import FeedbackItem from '@/components/productDetailPage/feedbackItem';
import queries from '@/queries/index.js';
import { memo } from 'react';

// const feedbackList = [
//     {
//         customer: "Vương Trung Tín",
//         rate: 5,
//         colour: "Đen",
//         size: "M",
//         content: "áo đẹp",
//         created_at: "2023-04-07T04:23:46.000Z"
//     },
//     {
//         customer: "Vương Trung Tín",
//         rate: 2,
//         colour: "Trắng",
//         size: "XL",
//         content: "áo quá rộng",
//         created_at: "2023-04-07T04:23:24.000Z"
//     },
//     {
//         customer: "Vương Trung Tín",
//         rate: 1,
//         colour: "Trắng",
//         size: "L",
//         content: "áo xấu quá!!!",
//         created_at: "2023-04-07T04:22:39.000Z"
//     }
// ]

const FeedbackBox = ({ productId }) => {
    const { isError, error, data } = useQuery({
        ...queries.products.feedbackList(productId),
        enabled: !!productId
    });
    if (isError) console.log(error);
    const feedbackList = data?.data;

    return (
        <div className="feedback-box row">
            {feedbackList &&
                feedbackList.map((feedback, index) => {
                    return (
                        <FeedbackItem
                            key={index}
                            customer={feedback.customer}
                            rate={feedback.rate}
                            colour={feedback.colour}
                            size={feedback.size}
                            content={feedback.content}
                            createdAt={feedback.created_at}
                        />
                    );
                })}
        </div>
    );
};

export default memo(FeedbackBox);
