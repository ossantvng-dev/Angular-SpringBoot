import { Invoice } from "../models/invoice";
import { clients } from "./client.data";
import { companies } from "./company.data";
import { items } from "./item.data";


export const invoices: Invoice[] = [
  { id: 1, name: "Factura 001", client: clients[0], company: companies[0], items: [items[0], items[1]] },
  { id: 2, name: "Factura 002", client: clients[1], company: companies[1], items: [items[2]] },
  { id: 3, name: "Factura 003", client: clients[2], company: companies[2], items: [items[3], items[4], items[5]] },
  { id: 4, name: "Factura 004", client: clients[3], company: companies[3], items: [items[6]] },
  { id: 5, name: "Factura 005", client: clients[4], company: companies[4], items: [items[7], items[8]] },

  { id: 6, name: "Factura 006", client: clients[5], company: companies[5], items: [items[9], items[10]] },
  { id: 7, name: "Factura 007", client: clients[6], company: companies[6], items: [items[11]] },
  { id: 8, name: "Factura 008", client: clients[7], company: companies[7], items: [items[12], items[13]] },
  { id: 9, name: "Factura 009", client: clients[8], company: companies[8], items: [items[14], items[15], items[16]] },
  { id: 10, name: "Factura 010", client: clients[9], company: companies[9], items: [items[17]] },

  { id: 11, name: "Factura 011", client: clients[10], company: companies[10], items: [items[18], items[19]] },
  { id: 12, name: "Factura 012", client: clients[11], company: companies[11], items: [items[20]] },
  { id: 13, name: "Factura 013", client: clients[12], company: companies[12], items: [items[21], items[22]] },
  { id: 14, name: "Factura 014", client: clients[13], company: companies[13], items: [items[23], items[24]] },
  { id: 15, name: "Factura 015", client: clients[14], company: companies[14], items: [items[25]] },

  { id: 16, name: "Factura 016", client: clients[15], company: companies[15], items: [items[26], items[27]] },
  { id: 17, name: "Factura 017", client: clients[16], company: companies[16], items: [items[28]] },
  { id: 18, name: "Factura 018", client: clients[17], company: companies[17], items: [items[29], items[30]] },
  { id: 19, name: "Factura 019", client: clients[18], company: companies[18], items: [items[31], items[32], items[33]] },
  { id: 20, name: "Factura 020", client: clients[19], company: companies[19], items: [items[34]] },

  { id: 21, name: "Factura 021", client: clients[20], company: companies[0], items: [items[35], items[36]] },
  { id: 22, name: "Factura 022", client: clients[21], company: companies[1], items: [items[37]] },
  { id: 23, name: "Factura 023", client: clients[22], company: companies[2], items: [items[38], items[39]] },
  { id: 24, name: "Factura 024", client: clients[23], company: companies[3], items: [items[40], items[41]] },
  { id: 25, name: "Factura 025", client: clients[24], company: companies[4], items: [items[42]] },

  { id: 26, name: "Factura 026", client: clients[25], company: companies[5], items: [items[43], items[44]] },
  { id: 27, name: "Factura 027", client: clients[26], company: companies[6], items: [items[45]] },
  { id: 28, name: "Factura 028", client: clients[27], company: companies[7], items: [items[46], items[47]] },
  { id: 29, name: "Factura 029", client: clients[28], company: companies[8], items: [items[48], items[49], items[50]] },
  { id: 30, name: "Factura 030", client: clients[29], company: companies[9], items: [items[51]] },

  { id: 31, name: "Factura 031", client: clients[30], company: companies[10], items: [items[52], items[53]] },
  { id: 32, name: "Factura 032", client: clients[31], company: companies[11], items: [items[54]] },
  { id: 33, name: "Factura 033", client: clients[32], company: companies[12], items: [items[55], items[56]] },
  { id: 34, name: "Factura 034", client: clients[33], company: companies[13], items: [items[57], items[58]] },
  { id: 35, name: "Factura 035", client: clients[34], company: companies[14], items: [items[59]] },

  { id: 36, name: "Factura 036", client: clients[35], company: companies[15], items: [items[60], items[61]] },
  { id: 37, name: "Factura 037", client: clients[36], company: companies[16], items: [items[62]] },
  { id: 38, name: "Factura 038", client: clients[37], company: companies[17], items: [items[63], items[64]] },
  { id: 39, name: "Factura 039", client: clients[38], company: companies[18], items: [items[65], items[66], items[67]] },
  { id: 40, name: "Factura 040", client: clients[39], company: companies[19], items: [items[68]] },

  { id: 41, name: "Factura 041", client: clients[40], company: companies[0], items: [items[69], items[70]] },
  { id: 42, name: "Factura 042", client: clients[41], company: companies[1], items: [items[71]] },
  { id: 43, name: "Factura 043", client: clients[42], company: companies[2], items: [items[72], items[73]] },
  { id: 44, name: "Factura 044", client: clients[43], company: companies[3], items: [items[74], items[75]] },
  { id: 45, name: "Factura 045", client: clients[44], company: companies[4], items: [items[76]] },

  { id: 46, name: "Factura 046", client: clients[45], company: companies[5], items: [items[77], items[78]] },
  { id: 47, name: "Factura 047", client: clients[46], company: companies[6], items: [items[79]] },
  { id: 48, name: "Factura 048", client: clients[47], company: companies[7], items: [items[80], items[81]] },
  { id: 49, name: "Factura 049", client: clients[48], company: companies[8], items: [items[82], items[83], items[84]] },
  { id: 50, name: "Factura 050", client: clients[49], company: companies[9], items: [items[85]] },

  { id: 51, name: "Factura 051", client: clients[50], company: companies[10], items: [items[86], items[87]] },
  { id: 52, name: "Factura 052", client: clients[51], company: companies[11], items: [items[88]] },
  { id: 53, name: "Factura 053", client: clients[52], company: companies[12], items: [items[89], items[90]] },
  { id: 54, name: "Factura 054", client: clients[53], company: companies[13], items: [items[91], items[92]] },
  { id: 55, name: "Factura 055", client: clients[54], company: companies[14], items: [items[93]] },

  { id: 56, name: "Factura 056", client: clients[55], company: companies[15], items: [items[94], items[95]] },
  { id: 57, name: "Factura 057", client: clients[56], company: companies[16], items: [items[96]] },
  { id: 58, name: "Factura 058", client: clients[57], company: companies[17], items: [items[97], items[98]] },
  { id: 59, name: "Factura 059", client: clients[58], company: companies[18], items: [items[99]] },
  { id: 60, name: "Factura 060", client: clients[59], company: companies[19], items: [items[0], items[1]] },

  { id: 61, name: "Factura 061", client: clients[60], company: companies[0], items: [items[2], items[3]] },
  { id: 62, name: "Factura 062", client: clients[61], company: companies[1], items: [items[4]] },
  { id: 63, name: "Factura 063", client: clients[62], company: companies[2], items: [items[5], items[6]] },
  { id: 64, name: "Factura 064", client: clients[63], company: companies[3], items: [items[7], items[8]] },
  { id: 65, name: "Factura 065", client: clients[64], company: companies[4], items: [items[9]] },

  { id: 66, name: "Factura 066", client: clients[65], company: companies[5], items: [items[10], items[11]] },
  { id: 67, name: "Factura 067", client: clients[66], company: companies[6], items: [items[12]] },
  { id: 68, name: "Factura 068", client: clients[67], company: companies[7], items: [items[13], items[14]] },
  { id: 69, name: "Factura 069", client: clients[68], company: companies[8], items: [items[15], items[16], items[17]] },
  { id: 70, name: "Factura 070", client: clients[69], company: companies[9], items: [items[18]] },

  { id: 71, name: "Factura 071", client: clients[70], company: companies[10], items: [items[19], items[20]] },
  { id: 72, name: "Factura 072", client: clients[71], company: companies[11], items: [items[21]] },
  { id: 73, name: "Factura 073", client: clients[72], company: companies[12], items: [items[22], items[23]] },
  { id: 74, name: "Factura 074", client: clients[73], company: companies[13], items: [items[24], items[25]] },
  { id: 75, name: "Factura 075", client: clients[74], company: companies[14], items: [items[26]] },

  { id: 76, name: "Factura 076", client: clients[75], company: companies[15], items: [items[27], items[28]] },
  { id: 77, name: "Factura 077", client: clients[76], company: companies[16], items: [items[29]] },
  { id: 78, name: "Factura 078", client: clients[77], company: companies[17], items: [items[30], items[31]] },
  { id: 79, name: "Factura 079", client: clients[78], company: companies[18], items: [items[32], items[33], items[34]] },
  { id: 80, name: "Factura 080", client: clients[79], company: companies[19], items: [items[35]] },

  { id: 81, name: "Factura 081", client: clients[80], company: companies[0], items: [items[36], items[37]] },
  { id: 82, name: "Factura 082", client: clients[81], company: companies[1], items: [items[38]] },
  { id: 83, name: "Factura 083", client: clients[82], company: companies[2], items: [items[39], items[40]] },
  { id: 84, name: "Factura 084", client: clients[83], company: companies[3], items: [items[41], items[42]] },
  { id: 85, name: "Factura 085", client: clients[84], company: companies[4], items: [items[43]] },

  { id: 86, name: "Factura 086", client: clients[85], company: companies[5], items: [items[44], items[45]] },
  { id: 87, name: "Factura 087", client: clients[86], company: companies[6], items: [items[46]] },
  { id: 88, name: "Factura 088", client: clients[87], company: companies[7], items: [items[47], items[48]] },
  { id: 89, name: "Factura 089", client: clients[88], company: companies[8], items: [items[49], items[50], items[51]] },
  { id: 90, name: "Factura 090", client: clients[89], company: companies[9], items: [items[52]] },

  { id: 91, name: "Factura 091", client: clients[90], company: companies[10], items: [items[53], items[54]] },
  { id: 92, name: "Factura 092", client: clients[91], company: companies[11], items: [items[55]] },
  { id: 93, name: "Factura 093", client: clients[92], company: companies[12], items: [items[56], items[57]] },
  { id: 94, name: "Factura 094", client: clients[93], company: companies[13], items: [items[58], items[59]] },
  { id: 95, name: "Factura 095", client: clients[94], company: companies[14], items: [items[60]] },

  { id: 96, name: "Factura 096", client: clients[95], company: companies[15], items: [items[61], items[62]] },
  { id: 97, name: "Factura 097", client: clients[96], company: companies[16], items: [items[63]] },
  { id: 98, name: "Factura 098", client: clients[97], company: companies[17], items: [items[64], items[65]] },
  { id: 99, name: "Factura 099", client: clients[98], company: companies[18], items: [items[66], items[67], items[68]] },
  { id: 100, name: "Factura 100", client: clients[99], company: companies[19], items: [items[69]] }
];