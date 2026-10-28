"use server";

import { prisma } from "@/lib/prisma";

export type ScheduleFormState = {
  success?: boolean;
  error?: string;
  requestId?: string;
};

const WINDOW_START_TIMES: Record<string, string> = {
  morning: "08:00:00",
  afternoon: "12:00:00",
  evening: "16:00:00",
};

export async function schedulePickupAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  const customerName = formData.get("customerName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const pickupDateStr = formData.get("pickupDate")?.toString().trim();
  const pickupWindow = formData.get("pickupWindow")?.toString().trim();

  if (!customerName || !phone || !address || !pickupDateStr) {
    return { error: "Please fill in all required fields." };
  }

  if (!pickupWindow || !WINDOW_START_TIMES[pickupWindow]) {
    return { error: "Please choose a pickup window." };
  }

  const startTime = WINDOW_START_TIMES[pickupWindow];
  // Lagos is in West Africa Time (WAT), which is UTC+1 with no daylight saving time
  const isoString = `${pickupDateStr}T${startTime}+01:00`;
  const pickupDate = new Date(isoString);

  if (isNaN(pickupDate.getTime())) {
    return { error: "Please enter a valid date." };
  }

  try {
    const request = await prisma.pickupRequest.create({
      data: {
        customerName,
        phone,
        address,
        pickupDate,
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
