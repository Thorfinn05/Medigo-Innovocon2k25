import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const salesType = defineType({
    name: "sale",
    title: "Sale",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            title: "Sale Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Sale Description",
            type: "text",
        }),
        defineField({
            name: "discountAmount",
            title: "Discount Amount",
            type: "number",
            description: "The amount of discount in percentage",
        }),
        defineField({
            name: "couponCode",
            title: "Coupon Code",
            type: "string",
        }),
        defineField({
            name: "validFrom",
            title: "Valid From",
            type: "datetime",
        }),
        defineField({
            name: "validUntil",   
            title: "Valid Until",
            type: "datetime",
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            description: "Check if the sale is active",
            initialValue: true,
        }),
    ],  
    preview: {
        select: {
            title: "title",
            discountAmount: "discountAmount",
            couponCode: "couponCode",
            validFrom: "validFrom",
            validUntil: "validUntil",
            isActive: "isActive",
        },
        prepare(selection){
            const { title, discountAmount, couponCode, validFrom, validUntil, isActive } = selection;
            return {
                title,
                subtitle: `${discountAmount}% off | ${couponCode} | ${isActive ? "Active" : "Inactive"} | ${validFrom} - ${validUntil}`,
            };
        },
    },
});