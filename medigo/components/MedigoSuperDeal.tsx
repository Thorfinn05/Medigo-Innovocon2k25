import { COUPON_CODES } from "@/sanity/lib/sales/couponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

async function MedigoSuperDeal() {
    const sale = await getActiveSaleByCouponCode(COUPON_CODES.MEDIGO1008);

    if (!sale?.isActive) {
        return null; // no active sale
    }

    return (
        <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex-1">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-left mb-4">
                        {sale.title}
                    </h2>
                    <p className="text-left text-xl sm:text-3xl font-semibold mb-6">
                        {sale.description}
                    </p>

                    <div className="flex">
                        <div className="bg-white text-black py-4 px-6 rounded-full shadow-md transform hover:scale-105 transistion duration-300">
                            <span className="font-bold text-base sm:text-xl">
                                Use Code:{" "}
                                <span className="text-red-600">
                                    {sale.couponCode}
                                </span>
                            </span>
                            <span className="ml-2 font-bold text-base sm:text-xl">
                                for {sale.discountAmount}% OFF
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedigoSuperDeal;