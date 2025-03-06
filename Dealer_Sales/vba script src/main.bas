Attribute VB_Name = "main"
Public FileToOpen As Variant
Public Data_Arr() As helper.Records
Private index, customer_num As Integer
Sub main()
helper.LogClear
helper.Log ("Previous log cleared!")
helper.init_LUT
helper.Log ("Category LUT OK!")
helper.Init_SalesmanLUT
helper.Log ("Staff LUT OK!")

DataExtract dict_SHTEC, "SHTEC Data"
'#########################Reading IC data#####################
DataExtract dict_IC, "IC Data"
'#########################Reading JVC data#####################
DataExtract dict_JVC, "JVC Data"
FileOutput


End Sub

Private Sub DataExtract(dict As Dictionary, msg As String)
Dim Rng As Range
FileToOpen = Application.GetOpenFilename(Title:=msg, FileFilter:="Excel Files (*.xls*),*xls*")

If FileToOpen <> False Then
    FileToOpen = Split(FileToOpen, "\")(UBound(Split(FileToOpen, "\"))) 'assumed same dir
    helper.activateWb (FileToOpen)
    customer_num = customer_num + WorksheetFunction.CountIf(Range("A:A"), "****")
    'helper.Log (Customer_Num)
    ReDim Preserve Data_Arr(customer_num)
    'helper.Log (UBound(Data_Arr()))
    Worksheets(1).Range("A1").Activate
    Do Until IsEmpty(ActiveCell.Offset(1, 0).value) 'Loop until end of worksheet
    
        dealerName = ActiveCell.Offset(0, 2).value
        'Do when Staff_LUT success
        ActiveCell.Offset(1, 0).Activate
        Do Until ActiveCell.value = "****" Or IsEmpty(ActiveCell.value) 'Repeat until new customer flag detected
            If dict.Exists(ActiveCell.Offset(0, 1).value) Then ' when code as key exist in dict
                    With Data_Arr(index)
                    
                            .Customer_Name = dealerName
                            .Catergory_String = dict(ActiveCell.Offset(0, 1).value)
                            .Amount = ActiveCell.Offset(0, 3).value
                            .Quantity = ActiveCell.Offset(0, 5).value
                            .OriginalCell = ActiveCell.Address
                            helper.Log ("LUT OK at " & ActiveCell.Address & ", Code = " & ActiveCell.Offset(0, 1).value & " ,index = " & index)
                            helper.Log ("Data_Arr[" & index & "] = " & .Catergory_String & "->" & .Amount)
                     End With
                     index = index + 1
             Else: helper.Log ("LUT no match at " & ActiveCell.Address & ", Category_Code = " & ActiveCell.Offset(0, 1).value & " ,index = " & index)
             End If
             ActiveCell.Offset(1, 0).Activate    'go to next row
        Loop
skip_nostaff:
Loop
    
    
    
    
Else: MsgBox "Error Opening file, skipping " & msg, vbExclamation, "Error"

End If

End Sub

