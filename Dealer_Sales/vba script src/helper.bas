Attribute VB_Name = "helper"
Private Const LookupPath As String = "2024AprDealerSales_SDR1020.xls"
Public dict_SHTEC As New Scripting.Dictionary
Public dict_IC As New Scripting.Dictionary
Public dict_JVC As New Scripting.Dictionary

Public CompanytoCat_dict As New Scripting.Dictionary

Public Type Records
    ID As String
    Catergory_String As String
    Amount As Long
    Quantity As Integer
    Fixed_Dat As Date
    Customer_Name As String
    OriginalCell As String
End Type

Public Sub FileOutput()
Dim i As Integer
Dim Fileout As Workbook
Set Fileout = Workbooks.Add
With Fileout
   ' Workbooks(Fileout).Activate
    .Sheets.Add
    'Write Title

    .Worksheets(1).Range("A1").value = "°O¿ý°_©l¦C"
    .Worksheets(1).Range("B1").value = "Staff ID"
    .Worksheets(1).Range("C1").value = "Category"
    .Worksheets(1).Range("D1").value = "Sales Amount"
    .Worksheets(1).Range("E1").value = "Sales Quantity"
    .Worksheets(1).Range("F1").value = "Conclusion Date"
    .Worksheets(1).Range("G1").value = "Dealer Name"
    .Worksheets(1).Range("F:F").NumberFormat = "d/m/yy;@"
    
    'Dump Data_arr
    .Worksheets(1).Range("A2").Activate
    For i = 0 To UBound(Data_Arr())
            If (Data_Arr(i).Quantity = 0) Or (Not CompanytoCat_dict.Exists(Data_Arr(i).Customer_Name)) Then 'Temp Workaround
            helper.Log ("LUT failed while dumping , address = " & Data_Arr(i).OriginalCell & ",Customer name = " & Data_Arr(i).Customer_Name & ",Q = " & Data_Arr(i).Quantity)
 GoTo Skip
            End If
        ActiveCell.value = "*"
        ActiveCell.Offset(0, 1).value = CompanytoCat_dict(Data_Arr(i).Customer_Name)(Data_Arr(i).Catergory_String)
        ActiveCell.Offset(0, 2).value = Data_Arr(i).Catergory_String
        ActiveCell.Offset(0, 3).value = Data_Arr(i).Amount
        ActiveCell.Offset(0, 4).value = Data_Arr(i).Quantity
        ActiveCell.Offset(0, 5).value = CDate(Excel.Application.WorksheetFunction.EoMonth(Date, 0))
        ActiveCell.Offset(0, 6).value = Data_Arr(i).Customer_Name
        ActiveCell.Offset(0, 7).value = Data_Arr(i).OriginalCell
        ActiveCell.Offset(1, 0).Activate
Skip:
        Next i

    .SaveAs Filename:="Output_" & Format(Date, "dd mmmm yyyy")
    MsgBox "Dumping completed!"
    End With
End Sub
Public Sub init_LUT()
 Dim LUT_wb As Workbook
 Dim wrksht As Worksheet
 Set LUT_wb = Workbooks.Open(Filename:=ThisWorkbook.Path & "\" & LookupPath)
 Set wrksht = LUT_wb.Worksheets(1)
 'LUT_wb.Activate
 Dim i As Integer
 i = 2  'Starting at row 2
 While Not IsEmpty(wrksht.Cells(i, 2))  '2 = Column B
        
     dict_SHTEC.Add UCase(CStr(wrksht.Cells(i, 2).MergeArea.Cells(1, 1).value)), CStr(wrksht.Cells(i, 1).MergeArea.Cells(1, 1).value)
     i = i + 1
 Wend       'Read until Space detected->IC->JVC
 i = i + 1
 While Not IsEmpty(wrksht.Cells(i, 2)) 'read into dict_IC
    dict_IC.Add CStr(wrksht.Cells(i, 2).MergeArea.Cells(1, 1).value), CStr(wrksht.Cells(i, 1).MergeArea.Cells(1, 1).value)
    i = i + 1
 Wend
 i = i + 1
 While Not IsEmpty(wrksht.Cells(i, 1)) ' read into dict_JVC
    If IsEmpty(wrksht.Cells(i, 2)) Then
        dict_JVC.Add CStr(wrksht.Cells(i, 3).MergeArea.Cells(1, 1).value), CStr(wrksht.Cells(i, 1).MergeArea.Cells(1, 1).value)
    Else: dict_JVC.Add CStr(wrksht.Cells(i, 2).MergeArea.Cells(1, 1).value), CStr(wrksht.Cells(i, 1).MergeArea.Cells(1, 1).value)
    End If
    i = i + 1
 Wend
 LUT_wb.Close (False)
 'Debug.Print ("Printing Dict!")
 'PrintContents dict_SHTEC
 'Debug.Print ("Printing IC_dict")
 'PrintContents dict_IC
 'Debug.Print ("Printing JVC_dict")
 'PrintContents dict_JVC
End Sub

Private Sub PrintContents(dict As Scripting.Dictionary)
    
    Dim k As Variant
    For Each k In dict.keys
        ' Print key and value
        Debug.Print k, dict(k)
    Next

End Sub
Public Sub activateWb(wb_name As String)
On Error GoTo error_handling
Dim wb As Workbook
For Each wb In Workbooks 'activate if opened already
    If wb.Name = wb_name Then
        wb.Activate
        MsgBox "Begin Extracting " & wb_name
        Exit Sub
    End If
Next wb

Workbooks.Open Filename:=wb_name
Exit Sub

error_handling:

MsgBox Err.Description, vbExclamation, "Error Code: " & Err.Number
Resume Next

End Sub
Public Sub Init_SalesmanLUT() 'use company as key -> value as dict -> use cat as key on 2nd dict->get staff ID as val on 2nd dict
Dim FileToOpen As Variant
Dim dict_temp As New Scripting.Dictionary
CompanytoCat_dict.CompareMode = vbTextCompare
FileToOpen = Application.GetOpenFilename(Title:="Please select the same month target file", FileFilter:="Excel Files (*.xls*),*xls*")
If FileToOpen <> False Then
    activateWb (FileToOpen)
    Worksheets(1).Range("A2").Activate

    Do Until IsEmpty(ActiveCell.Offset(1, 0).value)
    Set dict_temp = New Scripting.Dictionary
    'dict_temp.RemoveAll
    If CompanytoCat_dict.Exists(ActiveCell.Offset(0, 1).value) Then 'Company already exist as a key
        If CompanytoCat_dict(ActiveCell.Offset(0, 1).value).Exists(ActiveCell.Offset(0, 2).value) Then 'Check if cat exist as key in 2nd dicti
            'setted up already, skip record
            Debug.Print ("Duplicated, Tier 1 key = " & ActiveCell.Offset(0, 1).value & ", Tier 2 key = " & ActiveCell.Offset(0, 2).value) & " ,Res = " & CompanytoCat_dict(ActiveCell.Offset(0, 1).value)(ActiveCell.Offset(0, 2).value)
            
        Else:      'Cat not exist as key in 2nd dict,add an extra key in 2nd dict
             CompanytoCat_dict(ActiveCell.Offset(0, 1).value).Add ActiveCell.Offset(0, 2).value, ActiveCell.value
             
             Debug.Print ("New Tier 2 Key, Tier 1 key = " & ActiveCell.Offset(0, 1).value & ", Tier 2 key = " & ActiveCell.Offset(0, 2).value) & " ,res = " & CompanytoCat_dict(ActiveCell.Offset(0, 1).value)(ActiveCell.Offset(0, 2).value)
             PrintContents CompanytoCat_dict(ActiveCell.Offset(0, 1).value)
             'key: CompanyName As String, val: CatTOSalesID As Dict \\\\\\ CatTOSalesID{key: Category as string,Val:SalesID as string}
        End If
    Else:   'Compnay does not exist as a key
            'Cat not exist as key in 2nd dict
            PrintContents dict_temp
            dict_temp.Add Key:=ActiveCell.Offset(0, 2).value, Item:=ActiveCell.value
           'TODO: MAke a function so that when using dict.add(keys as string,val as dict), the val is not passed as ref->val
            CompanytoCat_dict.Add ActiveCell.Offset(0, 1).value, dict_temp
           'key: CompanyName As String, val: CatTOSalesID As Dict \\\\\\ CatTOSalesID{key: Category as string,Val:SalesID as string}
    End If
    Debug.Print ("CELL ADDR = " & ActiveCell.Address)
    ActiveCell.Offset(1, 0).Activate
    
    Loop

End If
PrintContents CompanytoCat_dict("RISE TIDE LIMITED TRADING AS PANASHOP")
End Sub


Public Function Log(ByRef a_stringLogThis As String)
    ' prepare date
    l_stringDateTimeNow = Now
    l_stringToday = Format(l_stringDateTimeNow, "YYYY-MM-DD hh:mm:ss")
    ' concatenate date and what the user wants logged
    l_stringLogStatement = l_stringToday & " " & a_stringLogThis
    ' send to TTY
    'Debug.Print (l_stringLogStatement)
    ' append (not write) to disk
    Open ThisWorkbook.Path & "\Log.txt" For Append As #1
    Print #1, l_stringLogStatement
    Close #1
End Function

Public Function LogClear()
    Debug.Print ("Erasing the previous logs.")
    Open ThisWorkbook.Path & "\Log.txt" For Output As #1
    Print #1, ""
    Close #1
End Function

Private Sub Push_SubDict(ByVal Sub_Dict As Scripting.Dictionary, ByVal Modified_Dict As Dictionary, Key As String)
Modified_Dict.Add Key, Sub_Dict

End Sub
