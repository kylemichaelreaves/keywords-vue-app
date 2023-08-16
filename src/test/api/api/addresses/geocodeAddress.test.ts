import { geocodeAddress } from '../../../../api/address/geocodeAddress'
import {test} from 'vitest'
import {addressesMock} from "../../../mock/address";
import {AddressFields} from "@types/types";

describe('geocodeAddress', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });


    test('geocodeAddress returns address data when a valid address is provided', async () => {
        const address: AddressFields = {
            streetAddress: '123 Main St',
            unitOrAptNum: 'Apt 4B',
            municipality: 'New York',
            state: 'NY',
            zipcode: '10001',
        };

        const result = await geocodeAddress(address);

        expect(result).toEqual(addressesMock);
    });


    test('geocodeAddress throws an error when the address is undefined', async () => {
        await expect(geocodeAddress(undefined as any)).rejects.toThrow('address is undefined');
    });

})