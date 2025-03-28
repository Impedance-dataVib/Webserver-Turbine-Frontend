import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function NotActiveLicenseTable({ notActiveLicenseInfo }: any) {
  const status = (data: any) => {
    if (data === "Pending") {
      return "orange";
    } else {
      return "grey";
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Serial No</TableCell>
            <TableCell align="center">License No</TableCell>
            <TableCell align="center">Imported Date</TableCell>
            <TableCell align="center">Activation Date</TableCell>

            <TableCell align="center">Expiry Date</TableCell>

            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notActiveLicenseInfo.map((row: any, index: any) => (
            <TableRow
              key={row.activation_date}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {row?.license_number}
              </TableCell>
              <TableCell align="center">{row.created_date}</TableCell>
              <TableCell align="center">{row.activation_date}</TableCell>

              <TableCell align="center">{row.expiry_date}</TableCell>

              <TableCell
                sx={{ bgcolor: status(row.status), color: "white" }}
                align="center"
              >
                {row.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
