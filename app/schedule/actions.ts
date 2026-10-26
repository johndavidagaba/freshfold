"use server";

import { prisma } from "@/lib/prisma";

export type ScheduleFormState = {
  success?: boolean;
  error?: string;
  requestId?: string;
};

export async function schedulePickupAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  const customerName = formData.get("customerName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const pickupDateStr = formData.get("pickupDate")?.toString().trim();
  const itemCountStr = formData.get("itemCount")?.toString().trim();

  if (!customerName || !phone || !address || !pickupDateStr || !itemCountStr) {
    return { error: "Please fill in all fields." };
  }

  const itemCount = parseInt(itemCountStr, 10);
  if (isNaN(itemCount) || itemCount <= 0) {
    return { error: "Item count must be a positive number." };
  }

  const pickupDate = new Date(pickupDateStr);
  if (isNaN(pickupDate.getTime())) {
    return { error: "Please enter a valid date and time." };
  }

  try {
    const request = await prisma.pickupRequest.create({
      data: {
        customerName,
        phone,
        address,
        pickupDate,
        itemCount,
      },
    });

    return {
      success: true,
      requestId: request.id,
    };
  } catch (error) {
    console.error("Error creating pickup request:", error);
    return {
      error: "Unable to save pickup request. Please try again.",
    };
  }
}
